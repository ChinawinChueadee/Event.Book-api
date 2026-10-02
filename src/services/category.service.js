import { prisma } from "../libs/prisma.js";

export const findCategoryNames = async () => {
  const categories = await prisma.category.findMany({
    select: { name: true },
    orderBy: { id: "asc" },
  });
  return categories.map((c) => c.name);
};

export const findAllCategories = async () => {
  return await prisma.category.findMany({
    include: { _count: { select: { events: true } } },
    orderBy: { id: "asc" },
  });
};

export const findCategoryById = async (id) => {
  return await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { events: true } } },
  });
};

export const createCategory = async (data) => {
  return await prisma.category.create({ data });
};

// Event.category ถูกอัปเดตตามอัตโนมัติ (onUpdate: Cascade)
export const updateCategoryById = async (id, data) => {
  return await prisma.category.update({ where: { id }, data });
};

export const deleteCategoryById = async (id) => {
  return await prisma.category.delete({ where: { id } });
};
