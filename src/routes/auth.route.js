import express from "express";
import { getMe, login, register } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const authRoute = express.Router();

authRoute.post("/register", register);
authRoute.post("/login", login);

authRoute.get("/me", authMiddleware, getMe);

export default authRoute;
