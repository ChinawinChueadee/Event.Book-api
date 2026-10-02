import createHttpError from "http-errors";

// use after authMiddleware
export default function (req, res, next) {
  if (req.user?.role !== "ADMIN") {
    throw createHttpError[403]("Admin only");
  }
  next();
}
