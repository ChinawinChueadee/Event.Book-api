import createHttpError from "http-errors";
import { prisma } from "../libs/prisma.js";

const userSelect = {
  select: { id: true, username: true, email: true }, // ไม่ดึง password มาด้วย
};

export const countBookingByEvent = async (eventId) => {
  return await prisma.booking.count({
    where: { eventId, status: { not: "CANCELLED" } },
  });
};

// Book an event inside a transaction. The event row is locked (FOR UPDATE)
// so two people cannot grab the last seat at the same time.
export const bookEvent = async (userId, eventId) => {
  return await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM Event WHERE id = ${eventId} FOR UPDATE`;

    const event = await tx.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw createHttpError[404]("Event not found");
    }
    if (event.userId === userId) {
      throw createHttpError[403]("You cannot book your own event");
    }
    if (event.status !== "OPEN") {
      throw createHttpError[400]("Event is not open for booking");
    }
    if (event.eventDate <= new Date()) {
      throw createHttpError[400]("Event has already started");
    }

    const bookedCount = await tx.booking.count({
      where: { eventId, status: { not: "CANCELLED" } },
    });
    if (bookedCount >= event.capacity) {
      throw createHttpError[400]("Event is full");
    }

    // เช็คก่อนว่ามี booking เดิม (รวมที่ cancelled) อยู่ไหม
    const existing = await tx.booking.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (existing) {
      if (existing.status !== "CANCELLED") {
        throw createHttpError[409]("You already booked this event");
      }
      // เคย cancel ไปแล้ว → reactivate แทนการสร้างใหม่
      return await tx.booking.update({
        where: { id: existing.id },
        data: { status: "PENDING" },
      });
    }

    return await tx.booking.create({
      data: { status: "PENDING", userId, eventId },
    });
  });
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
    include: { user: userSelect },
    orderBy: { bookedAt: "desc" },
  });
};

export const countBookingsByStatus = async (eventId) => {
  const groups = await prisma.booking.groupBy({
    by: ["status"],
    where: { eventId },
    _count: { _all: true },
  });
  const counts = { PENDING: 0, CONFIRMED: 0, CANCELLED: 0 };
  for (const g of groups) counts[g.status] = g._count._all;
  return counts;
};

export const findAllBookings = async (filters, paging) => {
  const where = {};
  if (filters.status) where.status = filters.status;
  if (filters.eventId) where.eventId = filters.eventId;
  if (filters.userId) where.userId = filters.userId;

  const [bookings, total] = await prisma.$transaction([
    prisma.booking.findMany({
      where,
      include: {
        user: userSelect,
        event: { select: { id: true, title: true, eventDate: true } },
      },
      orderBy: { bookedAt: "desc" },
      ...paging,
    }),
    prisma.booking.count({ where }),
  ]);
  return { bookings, total };
};
