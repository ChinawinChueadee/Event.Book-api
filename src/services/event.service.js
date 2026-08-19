import { prisma } from "../libs/prisma.js";

export const createEvent = async (data) => {
  return await prisma.event.create({ data });
};

export const findAllEvents = async () => {
  return await prisma.event.findMany();
};

export const findEventById = async (id) => {
  return await prisma.event.findUnique({ where: { id } });
};

export const findEventsByUser = async (userId) => {
  return await prisma.event.findMany({
    where: { userId },
    orderBy: { createAt: "desc" },
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
    include: {
      _count: {
        select: { bookings: true },
      },
    },
  });
};

export const searchEvents = async (filters) => {
  const where = {};

  if (filters.keyword) {
    where.OR = [
      { title: { contains: filters.keyword } },
      { location: { contains: filters.keyword } },
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

  if (filters.startDate || filters.endDate) {
    where.eventDate = {};
    if (filters.startDate) where.eventDate.gte = filters.startDate;
    if (filters.endDate) where.eventDate.lte = filters.endDate;
  }

  return await prisma.event.findMany({
    where,
    orderBy: { eventDate: "asc" },
  });
};
