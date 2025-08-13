import axios from "axios";
import config from "../../../config";
import { prisma } from "../../../shared/prisma";
import { SSlService } from "../SSL/SSL.service";
import { PaymentStatus } from "../../../generated/prisma";

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
    amount: paymentData.amount,
    transactionId: paymentData.transactionId,
    name: paymentData.appointment.patient.name,
    email: paymentData.appointment.patient.email,
    address: paymentData.appointment.patient.address,
    contactNumber: paymentData.appointment.patient.contactNumber,
  };

  const result = await SSlService.initPayment(paymentInformation);

  return {
    paymentUrl: result.GatewayPageURL,
  };
};

const validatePayment = async (payload: any) => {
  const response = await SSlService.validatePayment(payload);

  if (response.status !== "VALID") {
    return {
      message: "Payment validation failed",
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.updateMany({
      where: {
        transactionId: response.tran_id,
      },
      data: {
        status: PaymentStatus.PAID,
        paymentGetWayData: response,
      },
    });
  });
};

export const paymentServices = {
  initPayment,
  validatePayment,
};
