import express from "express";
import authRoute from "./routes/auth.route.js";
import createHttpError from "http-errors";
import userRoute from "./routes/users.route.js";
import eventRoute from "./routes/events.route.js";
import bookingRoute from "./routes/bookings.route.js";
import hostRoute from "./routes/host.route.js";
import adminRoute from "./routes/admin.route.js";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"], // allowed origins
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true, // allow cookies if needed
  }),
);

app.use(express.json());

app.use("/auth", authRoute);

app.use("/users", userRoute);

app.use("/events", eventRoute);

app.use("/bookings", bookingRoute);

app.use("/host", hostRoute);

app.use("/admin", adminRoute);

app.use((req, res, next) => {
  return next(createHttpError.NotFound());
});

app.use(errorMiddleware);

export default app;
