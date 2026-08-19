import createHttpError from "http-errors";
import {
  createBookingSchema,
  updateBookingSchema,
} from "../validations/schema.js";
import {
  findEventById,
  countBookingByEvent,
  createBooking,
  findBookingsByUser,
  updateBookingById,
  findBookingById,
  cancelBookingById,
  findBookingByIdWithEvent,
} from "../services/booking.service.js";

export async function bookingCreate(req, res, next) {
  try {
    const data = await createBookingSchema.parseAsync(req.body);

    const event = await findEventById(data.eventId);
    if (!event) {
      return next(createHttpError[404]("Event not found"));
    }

    if (event.userId === req.user.id) {
      return next(createHttpError[403]("You cannot book your own event"));
    }

    const bookedCount = await countBookingByEvent(data.eventId);
    if (bookedCount >= event.capacity) {
      return next(createHttpError[400]("Event is full"));
    }

    const booking = await createBooking({
      status: "PENDING",
      userId: req.user.id,
      eventId: data.eventId,
    });

    res.status(201).json({
      message: "Booking created successfully",
      data: booking,
    });
  } catch (err) {
    if (err.code === "P2002") {
      return next(createHttpError[409]("You already booked this event"));
    }
    next(err);
  }
}

export async function getMyBookings(req, res, next) {
  try {
    const bookings = await findBookingsByUser(req.user.id);
    res.json({ data: bookings });
  } catch (err) {
    next(err);
  }
}

export async function bookingUpdate(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return next(createHttpError[400]("Invalid booking id"));
    }

    const data = await updateBookingSchema.parseAsync(req.body);

    const booking = await findBookingById(id);
    if (!booking) {
      return next(createHttpError[404]("Booking not found"));
    }

    if (booking.userId !== req.user.id) {
      return next(createHttpError[403]("You can only update your own booking"));
    }

    const updatedBooking = await updateBookingById(id, data);

    res.json({
      message: "Booking updated successfully",
      data: updatedBooking,
    });
  } catch (err) {
    if (err.code === "P2025") {
      return next(createHttpError[404]("Booking not found"));
    }
    next(err);
  }
}

export async function bookingCancel(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return next(createHttpError[400]("Invalid booking id"));
    }

    const booking = await findBookingById(id);
    if (!booking) {
      return next(createHttpError[404]("Booking not found"));
    }

    if (booking.userId !== req.user.id) {
      return next(createHttpError[403]("You can only cancel your own booking"));
    }

    if (booking.status === "CANCELLED") {
      return next(createHttpError[400]("Booking already cancelled"));
    }

    const cancelledBooking = await cancelBookingById(id);

    res.json({
      message: "Booking cancelled successfully",
      data: cancelledBooking,
    });
  } catch (err) {
    if (err.code === "P2025") {
      return next(createHttpError[404]("Booking not found"));
    }
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return next(createHttpError[400]("Invalid booking id"));
    }

    const booking = await findBookingByIdWithEvent(id);
    if (!booking) {
      return next(createHttpError[404]("Booking not found"));
    }

    if (booking.userId !== req.user.id) {
      return next(createHttpError[403]("You can only view your own booking"));
    }

    res.json({ data: booking });
  } catch (err) {
    next(err);
  }
}
