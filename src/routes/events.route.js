import express from "express";
import {
  create,
  getAll,
  getEventBookings,
  getEventById,
  getMyEvents,
  remove,
  search,
  update,
} from "../controllers/event.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const eventRoute = express.Router();

eventRoute.get("/", getAll);
eventRoute.get("/search", search);
eventRoute.post("/", authMiddleware, create);
eventRoute.get("/:id/bookings", authMiddleware, getEventBookings);
eventRoute.get("/me", authMiddleware, getMyEvents);
eventRoute.get("/:id", getEventById);
eventRoute.patch("/:id", authMiddleware, update);
eventRoute.delete("/:id", authMiddleware, remove);

export default eventRoute;
