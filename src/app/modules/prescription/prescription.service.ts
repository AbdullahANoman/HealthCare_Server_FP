import httpStatus from "http-status";
import { AppointmentStatus, PaymentStatus } from "../../../generated/prisma";
import { prisma } from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { IAuthUser } from "../../interfaces/common";

const createIntoDB = async (user: IAuthUser, payload: any) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      status: AppointmentStatus.COMPLETED,
      paymentStatus:PaymentStatus.PAID,
    },
    include:{
        doctor: true,
    }
  });

  if(!(user.email === appointmentData.doctor.email)){
    throw new ApiError(httpStatus.BAD_REQUEST,"You are not allowed to create a prescription for this appointment");
  }


  const prescriptionData = {
    appointmentId : appointmentData.id,
    patientId: appointmentData.patientId,
    doctorId: appointmentData.doctorId,
    ...payload
  }


  if(prescriptionData){
    const result = await prisma.prescription.create({
      data: prescriptionData,
      include:{
        doctor: true,
        patient: true,
        appointment: true,
      }
    });

    return result
  }

};

export const prescriptionServices = {
  createIntoDB,
};
