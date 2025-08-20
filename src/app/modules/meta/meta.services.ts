import { UserRole } from "../../../generated/prisma";
import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";

const fetcheDashboardMetaData = async (user: IAuthUser) => {
  switch (user.role) {
    case UserRole.SUPER_ADMIN:
      getSuperAdminMetaData();
      break;
    case UserRole.ADMIN:
      getAdminMetaData();
      break;
    case UserRole.DOCTOR:
      getDoctorMetaData(user as IAuthUser);
      break;
    case UserRole.PATIENT:
      getPatientMetaData();
      break;
    default:
      throw new Error("Invalid user role!");
  }
};

const getSuperAdminMetaData = async () => {
  console.log("super admin");
};

const getAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCoount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
  });

  console.log({
    appointmentCount,
    patientCoount,
    doctorCount,
    paymentCount,
    totalRevenue,
  });
};
const getDoctorMetaData = async (user: IAuthUser) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const patientCount = await prisma.appointment.groupBy({
    by: ["patientId"],
  });

  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      appointment: {
        doctorId: doctorData.id,
      },
    },
  });

  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
    where: {
      doctorId: doctorData.id,
    },
  });

  const formattedAppointmentStatusDistribution =
    appointmentStatusDistribution.map((count) => ({
      status: count.status,
      count: Number(count._count.id),
    }));

  console.log(formattedAppointmentStatusDistribution);
};

const getPatientMetaData = async () => {
  console.log("patient");
};

export const MetaServices = {
  fetcheDashboardMetaData,
};
