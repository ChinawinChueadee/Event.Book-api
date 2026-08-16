import { z, ZodError } from "zod";

export default (err, req, res, next) => {
  if (err instanceof ZodError) {
    console.log(err.flatten());
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

  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    message: err.message || "Server Error !!",
  });
};
