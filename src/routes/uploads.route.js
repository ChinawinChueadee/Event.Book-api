import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { uploadImageMiddleware } from "../middlewares/upload.middleware.js";
import { uploadImageController } from "../controllers/upload.controller.js";

const uploadRoute = express.Router();

uploadRoute.post(
  "/image",
  authMiddleware,
  uploadImageMiddleware,
  uploadImageController,
);

export default uploadRoute;
