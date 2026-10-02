import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import {
  deleteUser,
  getAllBookings,
  getAllUsers,
  updateUserRole,
} from "../controllers/admin.controller.js";
import {
  addCategory,
  getAllCategoriesAdmin,
  removeCategory,
  renameCategory,
} from "../controllers/category.controller.js";

const adminRoute = express.Router();

adminRoute.use(authMiddleware, adminMiddleware);

adminRoute.get("/bookings", getAllBookings);
adminRoute.get("/users", getAllUsers);
adminRoute.patch("/users/:id", updateUserRole);
adminRoute.delete("/users/:id", deleteUser);

adminRoute.get("/categories", getAllCategoriesAdmin);
adminRoute.post("/categories", addCategory);
adminRoute.patch("/categories/:id", renameCategory);
adminRoute.delete("/categories/:id", removeCategory);

export default adminRoute;
