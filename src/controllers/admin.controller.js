import createHttpError from "http-errors";
import {
  adminBookingQuerySchema,
  adminUpdateUserSchema,
  adminUserQuerySchema,
} from "../validations/schema.js";
import { findAllBookings } from "../services/booking.service.js";
import {
  deleteUserById,
  findAllUsers,
  updateUserById,
} from "../services/user.service.js";

const parseUserId = (req) => {
  const id = Number(req.params.id);
  if (isNaN(id)) throw createHttpError[400]("Invalid user id");
  // กันแอดมินลดสิทธิ์/ลบตัวเองจนไม่มีใครเป็นแอดมิน
  if (id === req.user.id) {
    throw createHttpError[400]("You cannot change your own account here");
  }
  return id;
};
import { paginationMeta, toPaging } from "../utils/pagination.util.js";

export async function getAllBookings(req, res, next) {
  try {
    const filters = await adminBookingQuerySchema.parseAsync(req.query);
    const { bookings, total } = await findAllBookings(
      filters,
      toPaging(filters),
    );
    res.json({ data: bookings, pagination: paginationMeta(filters, total) });
  } catch (err) {
    next(err);
  }
}

export async function getAllUsers(req, res, next) {
  try {
    const filters = await adminUserQuerySchema.parseAsync(req.query);
    const { users, total } = await findAllUsers(filters, toPaging(filters));
    res.json({ data: users, pagination: paginationMeta(filters, total) });
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const id = parseUserId(req);
    const data = await adminUpdateUserSchema.parseAsync(req.body);
    const {
      password,
      resetToken,
      resetTokenExpiresAt,
      ...userData
    } = await updateUserById(id, data);
    res.json({ message: "User role updated", data: userData });
  } catch (err) {
    if (err.code === "P2025") {
      return next(createHttpError[404]("User not found"));
    }
    next(err);
  }
}

// ลบ user พร้อม event และ booking ของเขา (onDelete: Cascade)
export async function deleteUser(req, res, next) {
  try {
    const id = parseUserId(req);
    await deleteUserById(id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    if (err.code === "P2025") {
      return next(createHttpError[404]("User not found"));
    }
    next(err);
  }
}
