import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validations/schema.js";
import {
  createUser,
  findUserByResetToken,
  getUserBy,
  updateUserById,
} from "../services/user.service.js";

const RESET_TOKEN_TTL_MINUTES = 30;
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export async function register(req, res, next) {
  const data = await registerSchema.parseAsync(req.body);

  const haveUser = await getUserBy("email", data.email);
  if (haveUser) {
    return next(createHttpError[409]("Email is already registered"));
  }
  const newUser = {
    email: data.email,
    username: data.username,
    password: await bcrypt.hash(data.password, 10),
  };
  const result = await createUser(newUser);
  const { password, resetToken, resetTokenExpiresAt, ...userData } = result;

  res.status(201).json({
    message: "Register Successful",
    result: userData,
  });
}

export async function login(req, res, next) {
  const data = loginSchema.parse(req.body);

  const foundUser = await getUserBy("email", data.email);
  if (!foundUser) {
    return next(createHttpError[401]("Invalid email or password"));
  }
  let pwOk = await bcrypt.compare(data.password, foundUser.password);
  if (!pwOk) {
    return next(createHttpError[401]("Invalid email or password"));
  }

  const payload = { id: foundUser.id };
  // remember me → อยู่ได้ 15 วัน, ไม่ติ๊ก → 1 วัน
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: data.remember ? "15d" : "1d",
  });
  const {
    password,
    createdAt,
    resetToken,
    resetTokenExpiresAt,
    ...userData
  } = foundUser;
  res.json({
    message: "Login Successful",
    token: token,
    user: userData,
  });
}

export async function logout(req, res, next) {
  res.json({ message: "Logout successful" });
}

export async function forgotPassword(req, res, next) {
  const data = forgotPasswordSchema.parse(req.body);
  // ตอบข้อความเดียวกันเสมอ ไม่ให้รู้ว่าอีเมลนี้มีในระบบหรือไม่
  const response = {
    message: "If this email is registered, a reset link has been sent.",
  };

  const foundUser = await getUserBy("email", data.email);
  if (foundUser) {
    const token = crypto.randomBytes(32).toString("hex");
    await updateUserById(foundUser.id, {
      resetToken: hashToken(token),
      resetTokenExpiresAt: new Date(
        Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000,
      ),
    });

    const webUrl = process.env.WEB_URL || "http://localhost:5173";
    const resetUrl = `${webUrl}/reset-password?token=${token}`;
    // ยังไม่มีระบบส่งอีเมล → log ลิงก์ไว้ และส่งกลับมาด้วยตอน dev
    console.log(`Password reset link for ${foundUser.email}: ${resetUrl}`);
    if (process.env.NODE_ENV !== "production") {
      response.resetUrl = resetUrl;
    }
  }

  res.json(response);
}

export async function resetPassword(req, res, next) {
  const data = resetPasswordSchema.parse(req.body);

  const foundUser = await findUserByResetToken(hashToken(data.token));
  if (!foundUser) {
    return next(createHttpError[400]("Reset link is invalid or has expired"));
  }

  await updateUserById(foundUser.id, {
    password: await bcrypt.hash(data.password, 10),
    resetToken: null,
    resetTokenExpiresAt: null,
  });

  res.json({ message: "Password has been reset. Please log in." });
}
