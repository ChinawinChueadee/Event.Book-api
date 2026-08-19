import {
  createEventSchema,
  searchEventSchema,
  updateEventSchema,
} from "../validations/schema.js";
import createHttpError from "http-errors";
import {
  createEvent,
  deleteEventById,
  findAllEvents,
  findEventById,
  findEventByIdWithCount,
  findEventsByUser,
  searchEvents,
  updateEventById,
} from "../services/event.service.js";
import { findBookingsByEvent } from "../services/booking.service.js";

export async function create(req, res, next) {
  try {
    const data = await createEventSchema.parseAsync(req.body);

    const event = await createEvent({
      ...data,
      userId: req.user.id,
    });

    res.status(201).json({
      message: "Event created successfully",
      data: event,
    });
  } catch (err) {
    next(err);
  }
}

export async function getAll(req, res, next) {
  try {
    const events = await findAllEvents();
    res.json({ data: events });
  } catch (err) {
    next(err);
  }
}

export async function getMyEvents(req, res, next) {
  try {
    const events = await findEventsByUser(req.user.id);
    res.json({ data: events });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);

    const event = await findEventById(id);
    if (!event) {
      return next(createHttpError[404]("Event not found"));
    }

    if (event.userId !== req.user.id) {
      return next(createHttpError[403]("You can only delete your own event"));
    }

    await deleteEventById(id);

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = await updateEventSchema.parseAsync(req.body);

    const event = await findEventById(id);
    if (!event) {
      return next(createHttpError[404]("Event not found"));
    }

    if (event.userId !== req.user.id) {
      return next(createHttpError[403]("You can only update your own event"));
    }

    const updatedEvent = await updateEventById(id, data);

    res.json({
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (err) {
    next(err);
  }
}

export async function getEventBookings(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return next(createHttpError[400]("Invalid event id"));
    }

    const event = await findEventById(id);
    if (!event) {
      return next(createHttpError[404]("Event not found"));
    }

    if (event.userId !== req.user.id) {
      return next(
        createHttpError[403]("You can only view bookings of your own event"),
      );
    }

    const bookings = await findBookingsByEvent(id);

    res.json({ data: bookings });
  } catch (err) {
    next(err);
  }
}

export async function getEventById(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return next(createHttpError[400]("Invalid event id"));
    }

    const event = await findEventByIdWithCount(id);
    if (!event) {
      return next(createHttpError[404]("Event not found"));
    }

    res.json({ data: event });
  } catch (err) {
    next(err);
  }
}

export async function search(req, res, next) {
  try {
    const filters = await searchEventSchema.parseAsync(req.query);

    const events = await searchEvents(filters);

    res.json({ data: events });
  } catch (err) {
    next(err);
  }
}
