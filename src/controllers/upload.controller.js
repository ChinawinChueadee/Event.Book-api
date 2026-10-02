import createHttpError from "http-errors";
import { uploadImage } from "../services/upload.service.js";

export async function uploadImageController(req, res, next) {
  try {
    if (!req.file) {
      return next(
        createHttpError[400]("image file is required (field: image)"),
      );
    }

    const url = await uploadImage(req.file.buffer);

    res.status(201).json({ url });
  } catch (err) {
    // Cloudinary ปฏิเสธไฟล์ (เช่นนามสกุลรูปแต่ข้างในไม่ใช่รูป)
    if (err.http_code === 400) {
      return next(createHttpError[400]("Invalid image file"));
    }
    // 401/403 = ค่า CLOUDINARY_* ใน .env ผิด → 500 และ log ไว้ให้ดู
    console.error("Cloudinary upload failed:", err.message);
    next(createHttpError[500]("Image upload failed"));
  }
}
