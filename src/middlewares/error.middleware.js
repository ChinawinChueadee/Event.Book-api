import { z, ZodError } from "zod";
import { MulterError } from "multer";

export default (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation Error",
      errors: z.flattenError(err).fieldErrors,
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "Token Expired",
      message: "Your session has expired. Please log in again.",
    });
  }
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Invalid Token",
      message: "The provided token is invalid or malformed.",
    });
  }

  if (err instanceof MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Image must be 5MB or smaller"
        : err.code === "LIMIT_UNEXPECTED_FILE"
          ? "Send a single file in field: image"
          : err.message;
    const status = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    return res.status(status).json({ status, message });
  }

  // Prisma errors that were not handled in a controller
  if (err.code === "P2002") {
    return res
      .status(409)
      .json({ status: 409, message: "Data already exists" });
  }
  if (err.code === "P2025") {
    return res.status(404).json({ status: 404, message: "Data not found" });
  }

  if (!err.status || err.status >= 500) {
    console.error(err);
  }

  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    message: err.message || "Server Error !!",
  });
};
