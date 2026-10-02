import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import { getAllBookings, getAllUsers } from "../controllers/admin.controller.js";

const adminRoute = express.Router();

adminRoute.use(authMiddleware, adminMiddleware);

adminRoute.get("/bookings", getAllBookings);
adminRoute.get("/users", getAllUsers);

export default adminRoute;
