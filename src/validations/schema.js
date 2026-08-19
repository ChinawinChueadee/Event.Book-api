import { email, z } from "zod";
import bcrypt from "bcryptjs";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(2, "Email require")
      .refine((value) => emailRegex.test(value), {
        message: "must be a valid email",
      }),
    username: z.string().min(2, "username is required"),
    password: z.string().min(4, "password at least 4 characters"),
    confirmPassword: z.string().min(1, "confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "confirmPassword must match password",
    path: ["confirmPassword"],
  })
  .transform(async (data) => {
    const output = {
      email: data.email,
      username: data.username,
      password: await bcrypt.hash(data.password, 8),
    };
    return output;
  });

export const loginSchema = z
  .object({
    email: z
      .string()
      .min(2, "Email require")
      .refine((value) => emailRegex.test(value), {
        message: "gmail must be a valid email",
      }),
    password: z.string().min(4, "password at least 4 characters"),
  })
  .transform((data) => ({
    email: data.email,
    password: data.password,
  }));

export const createEventSchema = z.object({
  title: z.string().min(2, "title is required"),
  category: z.string().min(2, "category is required"),
  status: z.enum(["OPEN", "CLOSED", "CANCELLED"]).optional(),
  eventDate: z.coerce.date({ message: "eventDate must be a valid date" }),
  location: z.string().min(2, "location is required"),
  capacity: z
    .number({ message: "capacity is required" })
    .positive("capacity must be greater than 0"),
});

export const updateEventSchema = z
  .object({
    title: z.string().min(2, "title is required"),
    category: z.string().min(2, "category is required"),
    status: z.string().min(2, "status is required"),
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
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"], {
    message: "status must be PENDING, CONFIRMED or CANCELLED",
  }),
});

export const updateProfileSchema = z
  .object({
    username: z.string().min(2, "username must be at least 2 characters"),
  })
  .partial();

export const searchEventSchema = z.object({
  keyword: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  location: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});
