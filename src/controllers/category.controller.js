import createHttpError from "http-errors";
import { categoryNameSchema } from "../validations/schema.js";
import {
  createCategory,
  deleteCategoryById,
  findAllCategories,
  findCategoryById,
  findCategoryNames,
  updateCategoryById,
} from "../services/category.service.js";

const parseCategoryId = (req) => {
  const id = Number(req.params.id);
  if (isNaN(id)) throw createHttpError[400]("Invalid category id");
  return id;
};

// PUBLIC: รายชื่อหมวดอย่างเดียว เช่น ["TECH", "MUSIC"]
export async function getCategories(req, res, next) {
  try {
    res.json({ data: await findCategoryNames() });
  } catch (err) {
    next(err);
  }
}

// ADMIN: มี id และจำนวน event ที่ใช้หมวดนั้น
export async function getAllCategoriesAdmin(req, res, next) {
  try {
    res.json({ data: await findAllCategories() });
  } catch (err) {
    next(err);
  }
}

export async function addCategory(req, res, next) {
  try {
    const data = await categoryNameSchema.parseAsync(req.body);
    const category = await createCategory(data);
    res.status(201).json({ message: "Category created", data: category });
  } catch (err) {
    if (err.code === "P2002") {
      return next(createHttpError[409]("Category already exists"));
    }
    next(err);
  }
}

export async function renameCategory(req, res, next) {
  try {
    const id = parseCategoryId(req);
    const data = await categoryNameSchema.parseAsync(req.body);
    const category = await updateCategoryById(id, data);
    res.json({ message: "Category updated", data: category });
  } catch (err) {
    if (err.code === "P2002") {
      return next(createHttpError[409]("Category already exists"));
    }
    if (err.code === "P2025") {
      return next(createHttpError[404]("Category not found"));
    }
    next(err);
  }
}

export async function removeCategory(req, res, next) {
  try {
    const id = parseCategoryId(req);

    const category = await findCategoryById(id);
    if (!category) {
      return next(createHttpError[404]("Category not found"));
    }

    const eventCount = category._count.events;
    if (eventCount > 0) {
      return next(
        createHttpError[409](
          `Category is used by ${eventCount} event(s). Move them to another category first.`,
        ),
      );
    }

    await deleteCategoryById(id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    // event ถูกสร้างด้วยหมวดนี้ระหว่างเช็คกับลบ (onDelete: Restrict)
    if (err.code === "P2003") {
      return next(createHttpError[409]("Category is used by events"));
    }
    next(err);
  }
}
