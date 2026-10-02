import { prisma } from "../libs/prisma.js";

export const getUserBy = async (column, value) => {
  return await prisma.user.findFirst({
    where: { [column]: value },
  });
};

export const createUser = async (userData) => {
  return await prisma.user.create({ data: userData });
};

export const updateUserById = async (id, data) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

export const deleteUserById = async (id) => {
  return await prisma.user.delete({ where: { id } });
};

export const findAllUsers = async (filters, paging) => {
  const where = {};
  if (filters.role) where.role = filters.role;
  if (filters.search) {
    where.OR = [
      { username: { contains: filters.search } },
      { email: { contains: filters.search } },
    ];
  }

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      omit: { password: true },
      include: { _count: { select: { events: true, bookings: true } } },
      orderBy: { createdAt: "desc" },
      ...paging,
    }),
    prisma.user.count({ where }),
  ]);
  return { users, total };
};
