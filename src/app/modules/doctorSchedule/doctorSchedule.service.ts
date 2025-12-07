import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { prisma } from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { IAuthUser } from "../../interfaces/common";
import { IPagination } from "../../interfaces/paginationInterface";

const createIntoDB = async (
  user: any,
  payload: {
    scheduleIds: string[];
  }
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorSchedules = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
  }));

  const result = await prisma.doctorSchedule.createMany({
    data: doctorSchedules,
  });

  return result;
};

const getMySchedule = async (
  filters: any,
  options: IPagination,
  user: IAuthUser
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { startDate, endDate, ...filteredData } = filters;
  const andConditions: Prisma.DoctorScheduleWhereInput[] = [];

  const doctorData = await prisma.doctor.findFirstOrThrow({
    where: {
      email: user.email,
    },
  });

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }

  if (Object.keys(filteredData).length > 0) {
    if (
      typeof filteredData.isBooked === "string" &&
      filteredData.isBooked === "true"
    ) {
      filteredData.isBooked = true;
    } else if (
      typeof filteredData.isBooked === "string" &&
      filteredData.isBooked === "false"
    ) {
      filteredData.isBooked = false;
    }

    andConditions.push({
      AND: Object.keys(filteredData).map((field) => ({
        [field]: {
          equals: filteredData[field as keyof typeof filteredData],
        },
      })),
    });
  }

  const whereConditions: Prisma.DoctorScheduleWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.doctorSchedule.findMany({
    where: {
      ...whereConditions,
      doctorId: doctorData.id,
    },
    skip: skip,
    take: limit,
    include: {
      appointment: {
        select: {
          status: true,
          videoCallingId: true,
          paymentStatus: true,
        },
      },
      schedule: {
        select: {
          startDateTime: true,
          endDateTime: true,
        },
      },
    },
  });

  const total = await prisma.doctorSchedule.count({
    where: {
      ...whereConditions,
      doctorId: doctorData.id,
    },
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const deleteFromDB = async (user: IAuthUser, scheduleId: string) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const isBookedSchedule = await prisma.doctorSchedule.findFirst({
    where: {
      doctorId: doctorData.id,
      scheduleId,
      isBooked: true,
    },
  });

  if (isBookedSchedule) {
    throw new ApiError(400, "This schedule is already booked");
  }

  const result = await prisma.doctorSchedule.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId,
      },
    },
  });

  return result;
};

const getAllFromDB = async (
  filters: any,
  options: IPagination,
  user: IAuthUser
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { startDate, endDate, doctorId, ...filteredData } = filters;
  const andConditions: Prisma.DoctorScheduleWhereInput[] = [];

  if (startDate && endDate) {
    andConditions.push({
      schedule: {
        AND: [
          {
            startDateTime: {
              gte: startDate,
            },
          },
          {
            endDateTime: {
              lte: endDate,
            },
          },
        ],
      },
    });
  }

  if (Object.keys(filteredData).length > 0) {
    andConditions.push({
      AND: Object.keys(filteredData).map((field) => ({
        [field]: {
          equals: filteredData[field as keyof typeof filteredData],
        },
      })),
    });
  }

  const whereConditions: Prisma.DoctorScheduleWhereInput = {
    AND: andConditions,
  };

  // Build doctor schedule query condition
  const doctorScheduleWhere: Prisma.DoctorScheduleWhereInput = {};

  // If doctorId is provided in filters, use it
  if (doctorId) {
    doctorScheduleWhere.doctorId = doctorId;
  }

  const doctorSchedules = await prisma.doctorSchedule.findMany({
    where: doctorScheduleWhere,
  });

  const doctorSchedulesIds = doctorSchedules.map(
    (schedule: any) => schedule.scheduleId
  );

  const result = await prisma.doctorSchedule.findMany({
    where: {
      ...whereConditions,
      doctorId: doctorId,
    },
    skip: skip,
    take: limit,
    include: {
      schedule: true,
    },
  });

  const total = await prisma.doctorSchedule.count({
    where: {
      ...whereConditions,
      doctorId,
    },
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const doctorScheduleServices = {
  createIntoDB,
  getMySchedule,
  deleteFromDB,
  getAllFromDB,
};
