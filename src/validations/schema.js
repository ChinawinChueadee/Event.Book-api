import { z } from "zod";
import { findCategoryNames } from "../services/category.service.js";

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
  remember: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.email("must be a valid email"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "token is required"),
    password: z.string().min(4, "password at least 4 characters"),
    confirmPassword: z.string().min(1, "confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "confirmPassword must match password",
    path: ["confirmPassword"],
  });

// form ส่ง "" มาเมื่อไม่ได้กรอกรูป → ถือว่าไม่มีรูป
const optionalImageUrl = z
  .union([z.url("eventImage must be a valid URL"), z.literal("")])
  .optional();

// ชื่อหมวดเก็บเป็นตัวพิมพ์ใหญ่เสมอ ("Tech" → "TECH")
const categoryName = z
  .string({ message: "category is required" })
  .trim()
  .min(2, "category must be at least 2 characters")
  .max(50, "category must be at most 50 characters")
  .transform((value) => value.toUpperCase());

// รับตัวพิมพ์เล็กได้ แต่ต้องเป็นหมวดที่มีอยู่ในตาราง Category
const categorySchema = categoryName.superRefine(async (value, ctx) => {
  const names = await findCategoryNames();
  if (!names.includes(value)) {
    ctx.addIssue({
      code: "custom",
      message: `category must be one of ${names.join(", ")}`,
    });
  }
});

export const categoryNameSchema = z.object({ name: categoryName });

const capacitySchema = z
  .number({ message: "capacity is required" })
  .int("capacity must be a whole number")
  .positive("capacity must be greater than 0");

export const createEventSchema = z.object({
  title: z.string().min(2, "title is required"),
  description: z.string().optional(),
  category: categorySchema,
  status: z.enum(["OPEN", "CLOSED", "CANCELLED"]).optional(),
  eventDate: z.coerce
    .date({ message: "eventDate must be a valid date" })
    .refine((date) => date > new Date(), "eventDate must be in the future"),
  location: z.string().min(2, "location is required"),
  capacity: capacitySchema,
  eventImage: optionalImageUrl.transform((url) => url || undefined),
});

export const updateEventSchema = z
  .object({
    title: z.string().min(2, "title is required"),
    description: z.string().optional(),
    category: categorySchema,
    status: z.enum(["OPEN", "CLOSED", "CANCELLED"], {
      message: "status must be OPEN, CLOSED or CANCELLED",
    }),
    // "" = ลบรูปออก
    eventImage: optionalImageUrl.transform((url) => (url === "" ? null : url)),
    eventDate: z.coerce.date({ message: "eventDate must be a valid date" }),
    location: z.string().min(2, "location is required"),
    capacity: capacitySchema,
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
    // "" = ลบรูปโปรไฟล์
    profileImage: z
      .union([z.url("profileImage must be a valid URL"), z.literal("")])
      .transform((url) => (url === "" ? null : url)),
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
  category: categorySchema.optional(),
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

export const adminUpdateUserSchema = z.object({
  role: z.enum(["USER", "ADMIN"], { message: "role must be USER or ADMIN" }),
});

export const adminUserQuerySchema = z.object({
  ...paginationShape,
  role: z.enum(["USER", "ADMIN"]).optional(),
  search: z.string().optional(),
});
