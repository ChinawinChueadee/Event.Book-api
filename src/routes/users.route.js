import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getMe } from "../controllers/users.controller.js";
import { updateProfile } from "../controllers/auth.controller.js";

const userRoute = express.Router();

userRoute.get("/me", authMiddleware, getMe);
userRoute.patch("/me", authMiddleware, updateProfile);

export default userRoute;
