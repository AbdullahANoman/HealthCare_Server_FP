"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorValidation = exports.updateDoctor = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.updateDoctor = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    contactNumber: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    registrationNumber: zod_1.z.string().optional(),
    experience: zod_1.z.number().optional(),
    gender: zod_1.z.enum([client_1.Gender.FEMALE, client_1.Gender.MALE]).optional(),
    appointmentFee: zod_1.z.number().optional(),
    qualification: zod_1.z.string().optional(),
    currentWorkingPlace: zod_1.z.string().optional(),
    designation: zod_1.z.string().optional(),
    averageRating: zod_1.z.number().optional(),
});
exports.doctorValidation = {
    updateDoctor: exports.updateDoctor,
};
