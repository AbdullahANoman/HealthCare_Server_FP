import { addHours, addMinutes, format } from "date-fns";
import { prisma } from "../../../shared/prisma";

const createIntoDB = async (payload: any) => {
  const { startDate, endDate, startTime, endTime } = payload;

  console.log(startDate, startTime);
  const interverlTime = 30;
  const scedules = [];

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addHours(
        `${format(currentDate, "yyyy-MM-dd")}`,
        Number(startTime.split(":")[0])
      )
    );

    const endDateTime = new Date(
      addHours(
        `${format(currentDate, "yyyy-MM-dd")}`,
        Number(endTime.split(":")[0])
      )
    );

    while (startDateTime < endDateTime) {
      const scheduleData = {
        startDateTime: startDateTime,
        endDateTime: addMinutes(startDateTime, interverlTime),
      };

      const result = await prisma.schedule.create({
        data: scheduleData,
      });
      scedules.push(result);
      startDateTime.setMinutes(startDateTime.getMinutes() + interverlTime);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  console.log(scedules)
  return scedules;
};
export const scheduleServices = {
  createIntoDB,
};
