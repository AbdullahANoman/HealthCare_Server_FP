## Root Cause
- The Postgres URL points to Supabase’s Pooler (`aws-1-...pooler.supabase.com:6543`), which uses PgBouncer in transaction pooling mode.
- Prisma 6.x uses prepared statements by default. PgBouncer (transaction pooling) does not support prepared statements, causing Postgres error `42P05: prepared statement "s21" already exists` during `prisma.user.findUniqueOrThrow()`.
- Additionally, several queries use `findUniqueOrThrow` with non-unique filters (e.g., `status: UserStatus.ACTIVE`). `findUnique*` must only filter by unique fields; this should be `findFirstOrThrow` when multiple filters are needed.

## Changes To Apply
1. Update database connection string to disable prepared statements with PgBouncer.
   - File: `.env`
   - Change `DATABASE_URL` from `postgresql://...:6543/postgres` to `postgresql://...:6543/postgres?pgbouncer=true`.
   - Optional: add `&connection_limit=1` to avoid exhausting pooler connections if your deployment is resource-constrained.

2. Correct Prisma queries that misuse `findUniqueOrThrow`.
   - Replace with `findFirstOrThrow` where you filter by non-unique fields.
   - Files and locations to update:
     - `src/app/modules/auth/auth.service.ts`
       - `loginUser`: `auth.service.ts:12–17`
       - `refreshToken`: `auth.service.ts:68–73`
       - `changePassword`: `auth.service.ts:96–101`
       - `forgotPassword`: `auth.service.ts:128–133`
       - `resetPassword`: `auth.service.ts:162–167`
       - Use `prisma.user.findFirstOrThrow({ where: { email: ..., status: UserStatus.ACTIVE } })`.
     - `src/app/modules/user/user.service.ts`
       - `updateMyProfile`: `user.service.ts:252–255` → `findFirstOrThrow({ where: { email: user.email, status: UserStatus.ACTIVE } })`.
     - `src/app/modules/doctor/doctor.service.ts`
       - `softDeleteFromDB`: `doctor.service.ts:129–134` → `findFirstOrThrow({ where: { id, isDeleted: false } })`.
       - `updateIntoDB`: `doctor.service.ts:171–176` → `findFirstOrThrow({ where: { id, isDeleted: false } })`.
     - `src/app/modules/patient/patient.service.ts`
       - `updateIntoDB`: `patient.service.ts:107–112` → `findFirstOrThrow({ where: { id, isDeleted: false } })`.
   - Keep true unique lookups (e.g., `where: { id }`, `where: { email }`) as `findUniqueOrThrow`.

3. Minor correctness cleanups (safe but optional):
   - Use `boolean` instead of `Boolean` for bcrypt comparisons in `auth.service.ts` (`auth.service.ts:19`, `auth.service.ts:103`).
   - Consider converting some `throw new Error(...)` to `ApiError` with appropriate status to keep error handling uniform.

## What I Will Implement
- Edit `.env` to append `?pgbouncer=true` to `DATABASE_URL`.
- Refactor the listed Prisma calls to `findFirstOrThrow` where non-unique fields are present.
- Run code generation if needed (`npm run postinstall`), restart the dev server, and validate login and token flows.

## Validation Plan
- Start the server (`npm run dev`).
- Hit `POST /api/v1/auth/login` with a valid active user:
  - Expect HTTP 200 and tokens, no `42P05` error.
- Hit `POST /api/v1/auth/refresh-token` and `POST /api/v1/auth/change-password`:
  - Expect successful responses, confirming the corrected queries.
- Smoke-check affected modules where `findFirstOrThrow` was applied (doctor/patient update paths) for normal behavior.

## Rollback
- If issues arise, revert the query changes but keep `?pgbouncer=true` in the `DATABASE_URL`; the PgBouncer fix is required for Supabase Pooler.

## Notes
- If you prefer to avoid PgBouncer entirely, switch to the non-pooler host/port (`...supabase.com:5432`) with the standard Postgres URL; in that case you can omit `pgbouncer=true`.
- Prisma 6.7.0 fully supports the `pgbouncer=true` parameter; no client upgrade is needed.