import express from "express";
import {
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const authRoute = express.Router();

authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.post("/logout", authMiddleware, logout);
authRoute.post("/forgot-password", forgotPassword);
authRoute.post("/reset-password", resetPassword);
export default authRoute;
