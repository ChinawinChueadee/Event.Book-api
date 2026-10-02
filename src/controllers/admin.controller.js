import {
  adminBookingQuerySchema,
  adminUserQuerySchema,
} from "../validations/schema.js";
import { findAllBookings } from "../services/booking.service.js";
import { findAllUsers } from "../services/user.service.js";
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
