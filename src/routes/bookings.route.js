import express from "express";
import {
  bookingCreate,
  getMyBookings,
  bookingUpdate,
  bookingCancel,
  getById,
} from "../controllers/booking.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const bookingRoute = express.Router();

bookingRoute.post("/", authMiddleware, bookingCreate);
bookingRoute.get("/me", authMiddleware, getMyBookings);
bookingRoute.patch("/:id", authMiddleware, bookingUpdate);
bookingRoute.patch("/:id/cancel", authMiddleware, bookingCancel);
bookingRoute.get("/:id", authMiddleware, getById);

export default bookingRoute;
