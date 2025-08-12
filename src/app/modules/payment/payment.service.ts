import axios from "axios";
import config from "../../../config";
import { prisma } from "../../../shared/prisma";
import { SSlService } from "../SSL/SSL.service";


const initPayment = async (appointmentId: string) => {
  const paymentData = await prisma.payment.findFirstOrThrow({
    where: {
      appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });


  const paymentInformation = {
    amount : paymentData.amount,
    transactionId: paymentData.transactionId,
    name : paymentData.appointment.patient.name,
    email : paymentData.appointment.patient.email,
    address : paymentData.appointment.patient.address,
    contactNumber: paymentData.appointment.patient.contactNumber,
  }

  const result = await SSlService.initPayment(paymentInformation)

  return {
    paymentUrl: result.GatewayPageURL,
  }
};

const validatePayment = async(payload : any) =>{
    console.log(payload)
}

export const paymentServices = {
  initPayment,
  validatePayment
};
