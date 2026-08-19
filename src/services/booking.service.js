import { prisma } from "../libs/prisma.js";

export const findEventById = async (id) => {
  return await prisma.event.findUnique({ where: { id } });
};

export const countBookingByEvent = async (eventId) => {
  return await prisma.booking.count({ where: { eventId } });
};

export const createBooking = async (data) => {
  return await prisma.booking.create({ data });
};

export const findBookingsByUser = async (userId) => {
  return await prisma.booking.findMany({
    where: { userId },
    include: { event: true },
    orderBy: { bookedAt: "desc" },
  });
};

export const findBookingById = async (id) => {
  return await prisma.booking.findUnique({ where: { id } });
};

export const updateBookingById = async (id, data) => {
  return await prisma.booking.update({
    where: { id },
    data,
  });
};

export const cancelBookingById = async (id) => {
  return await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
};

export const findBookingByIdWithEvent = async (id) => {
  return await prisma.booking.findUnique({
    where: { id },
    include: { event: true },
  });
};

export const findBookingsByEvent = async (eventId) => {
  return await prisma.booking.findMany({
    where: { eventId },
    include: {
      user: {
        select: { id: true, username: true, email: true }, // ไม่ดึง password มาด้วย
      },
    },
    orderBy: { bookedAt: "desc" },
  });
};
