import multer from "multer";
import createHttpError from "http-errors";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// เก็บไฟล์ไว้ใน memory แล้วส่งต่อให้ upload.service ไม่เขียนลงดิสก์
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE, files: 1 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(
        createHttpError[400]("Only jpg, png and webp images are allowed"),
      );
    }
    cb(null, true);
  },
});

// รับไฟล์เดียวจาก field "image"
export const uploadImageMiddleware = upload.single("image");
