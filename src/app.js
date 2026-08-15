import express from "express";
import authRoute from "./routes/auth.route.js";
import createHttpError from "http-errors";

const app = express();
app.use(express.json());

app.use("/auth", authRoute);

app.use((req, res, next) => {
  return next(createHttpError.NotFound());
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    message: err.message || "Internal Server Error",
  });
});

export default app;
