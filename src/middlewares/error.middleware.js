import { z, ZodError } from "zod";

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

  if (!err.status || err.status >= 500) {
    console.error(err);
  }

  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    message: err.message || "Server Error !!",
  });
};
