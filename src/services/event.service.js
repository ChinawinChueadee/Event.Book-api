import { prisma } from "../libs/prisma.js";

const hostSelect = {
  select: { id: true, username: true, email: true },
};

// count only active bookings (not cancelled)
const activeBookingCount = {
  _count: {
    select: { bookings: { where: { status: { not: "CANCELLED" } } } },
  },
};

export const createEvent = async (data) => {
  return await prisma.event.create({ data });
};

export const findEventById = async (id) => {
  return await prisma.event.findUnique({ where: { id } });
};

export const findEventsByUser = async (userId) => {
  return await prisma.event.findMany({
    where: { userId },
    include: activeBookingCount,
    orderBy: { createdAt: "desc" },
  });
};

export const deleteEventById = async (id) => {
  return await prisma.event.delete({ where: { id } });
};

export const updateEventById = async (id, data) => {
  return await prisma.event.update({
    where: { id },
    data,
  });
};

export const findEventByIdWithCount = async (id) => {
  return await prisma.event.findUnique({
    where: { id },
    include: { user: hostSelect, ...activeBookingCount },
  });
};

export const searchEvents = async (filters, paging = {}) => {
  const where = {};

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { description: { contains: filters.search } },
      { location: { contains: filters.search } },
    ];
  }

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.location) {
    where.location = { contains: filters.location };
  }

  if (filters.date) {
    // match the whole day of the given date
    const start = new Date(filters.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    where.eventDate = { gte: start, lt: end };
  } else if (filters.startDate || filters.endDate) {
    where.eventDate = {};
    if (filters.startDate) where.eventDate.gte = filters.startDate;
    if (filters.endDate) where.eventDate.lte = filters.endDate;
  }

  const [events, total] = await prisma.$transaction([
    prisma.event.findMany({
      where,
      include: { user: hostSelect, ...activeBookingCount },
      orderBy: { eventDate: "asc" },
      ...paging,
    }),
    prisma.event.count({ where }),
  ]);
  return { events, total };
};
