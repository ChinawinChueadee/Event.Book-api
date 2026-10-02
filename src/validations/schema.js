import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.email("must be a valid email"),
    username: z.string().min(2, "username is required"),
    password: z.string().min(4, "password at least 4 characters"),
    confirmPassword: z.string().min(1, "confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "confirmPassword must match password",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email("must be a valid email"),
  password: z.string().min(4, "password at least 4 characters"),
});

export const createEventSchema = z.object({
  title: z.string().min(2, "title is required"),
  description: z.string().optional(),
  category: z.string().min(2, "category is required"),
  status: z.enum(["OPEN", "CLOSED", "CANCELLED"]).optional(),
  eventDate: z.coerce.date({ message: "eventDate must be a valid date" }),
  location: z.string().min(2, "location is required"),
  capacity: z
    .number({ message: "capacity is required" })
    .positive("capacity must be greater than 0"),
  eventImage: z.url("eventImage must be a valid URL").optional(),
});

export const updateEventSchema = z
  .object({
    title: z.string().min(2, "title is required"),
    description: z.string().optional(),
    category: z.string().min(2, "category is required"),
    status: z.enum(["OPEN", "CLOSED", "CANCELLED"], {
      message: "status must be OPEN, CLOSED or CANCELLED",
    }),
    eventImage: z.url("eventImage must be a valid URL").optional(),
    eventDate: z.coerce.date({ message: "eventDate must be a valid date" }),
    location: z.string().min(2, "location is required"),
    capacity: z
      .number({ message: "capacity is required" })
      .positive("capacity must be greater than 0"),
  })
  .partial();

export const createBookingSchema = z.object({
  eventId: z.number({ message: "eventId is required" }),
});

export const updateBookingSchema = z.object({
  status: z.enum(["CONFIRMED", "CANCELLED"], {
    message: "status must be CONFIRMED or CANCELLED",
  }),
});

export const updateProfileSchema = z
  .object({
    username: z.string().min(2, "username must be at least 2 characters"),
    profileImage: z.url("profileImage must be a valid URL"),
  })
  .partial();

const paginationShape = {
  page: z.coerce
    .number()
    .int()
    .positive("page must be greater than 0")
    .optional(),
  limit: z.coerce
    .number()
    .int()
    .positive("limit must be greater than 0")
    .max(100, "limit must be at most 100")
    .optional(),
};

export const searchEventSchema = z.object({
  ...paginationShape,
  search: z.string().optional(),
  category: z.string().optional(),
  date: z.coerce.date({ message: "date must be a valid date" }).optional(),
  status: z.enum(["OPEN", "CLOSED", "CANCELLED"]).optional(),
  location: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export const adminBookingQuerySchema = z.object({
  ...paginationShape,
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]).optional(),
  eventId: z.coerce.number().int().positive().optional(),
  userId: z.coerce.number().int().positive().optional(),
});

export const adminUserQuerySchema = z.object({
  ...paginationShape,
  role: z.enum(["USER", "ADMIN"]).optional(),
  search: z.string().optional(),
});
