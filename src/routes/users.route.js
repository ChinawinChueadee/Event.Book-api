import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  deleteMe,
  getMe,
  updateProfile,
} from "../controllers/users.controller.js";

const userRoute = express.Router();

userRoute.get("/me", authMiddleware, getMe);
userRoute.patch("/me", authMiddleware, updateProfile);
userRoute.delete("/me", authMiddleware, deleteMe);

export default userRoute;
