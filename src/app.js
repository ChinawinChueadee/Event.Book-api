import express from "express";
import authRoute from "./routes/auth.route.js";
import createHttpError from "http-errors";
import userRoute from "./routes/users.route.js";
import eventRoute from "./routes/events.route.js";
import bookingRoute from "./routes/bookings.route.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"], // allowed origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // allow cookies if needed
  }),
);

app.use(express.json());

app.use("/auth", authRoute);

app.use("/users", userRoute);

app.use("/events", eventRoute);

app.use("/bookings", bookingRoute);

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
