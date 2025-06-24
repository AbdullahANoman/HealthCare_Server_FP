import { Admin, Doctor, Prisma, UserStatus } from "../../../generated/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { prisma } from "../../../shared/prisma";
import { IPagination } from "../../interfaces/paginationInterface";
import { IQuery } from "../admin/admin.interface";
import { doctorSearchAbleFields } from "./doctor.constant";

const getAllFromDB = async (query: IQuery, options: IPagination) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filteredData } = query;
  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (query?.searchTerm) {
    andConditions.push({
      OR: doctorSearchAbleFields.map((field) => ({
        [field]: {
          contains: query?.searchTerm,
          mode: "insensitive",
        },
      })),
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

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.DoctorWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip: skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });

  const total = await prisma.doctor.count({
    where: whereConditions,
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

const getByIdFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const deleteFromDB = async (id: string) => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.$transaction(async (tx) => {
    const doctorDeleteData = await tx.doctor.delete({
      where: {
        id,
      },
    });
    await tx.user.delete({
      where: {
        email: doctorDeleteData.email,
      },
    });
    return doctorDeleteData;
  });
  return result;
};

const softDeleteFromDB = async (id: string) => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    const updateDoctor = await tx.doctor.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    const updateUser = await tx.user.update({
      where: {
        email: updateDoctor.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return updateUser;
  });

  return result;
};

type DoctorUpdatePayload = Partial<Doctor> & { specialties?: string[] };

const updateIntoDB = async (id: string, payload: DoctorUpdatePayload) => {
  const { specialties = [], ...doctorInfo } = payload;
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    const updateDoctor = await prisma.doctor.update({
      where: {
        id,
      },
      data: doctorInfo,
    });
    for (const specialtiesId of specialties) {
      const createSpecialties = await prisma.doctorSpecialties.create({
        data: {
          doctorId: id,
          specialtiesId: specialtiesId,
        },
      });
    }
    return updateDoctor;
  });
  return result;
};

export const doctorService = {
  getAllFromDB,
  getByIdFromDB,
  deleteFromDB,
  softDeleteFromDB,
  updateIntoDB,
};
