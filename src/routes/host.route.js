import express from "express";
import { getMyEvents } from "../controllers/event.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const hostRoute = express.Router();

hostRoute.get("/me/events", authMiddleware, getMyEvents);

export default hostRoute;
