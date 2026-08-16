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
      email: data.identity,
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
    email: data.identity,
    password: data.password,
  }));
