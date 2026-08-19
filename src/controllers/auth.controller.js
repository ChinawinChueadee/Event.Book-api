import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import identityKeyUtil from "../utils/identity-key.util.js";
import { prisma } from "../libs/prisma.js";
import bcrypt from "bcryptjs";
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "../validations/schema.js";
import {
  createUser,
  getUserBy,
  updateUserById,
} from "../services/user.service.js";

export async function register(req, res, next) {
  const { identity, username, password, confirmPassword } = req.body;

  const data = await registerSchema.parseAsync(req.body);

  const email = data.email;
  //   const identityKey = identityKeyUtil(identity);
  //   if (!identityKey) {
  //     return next(createHttpError[400]("identity must be email"));
  //   }

  const haveUser = await getUserBy("email", data.email);
  if (haveUser) {
    return next(createHttpError[409]("This user already register"));
  }
  const newUser = {
    email,
    username,
    password: await bcrypt.hash(password, 10),
  };
  const result = await createUser(newUser);

  res.json({
    message: "Register Successful",
    result: result,
  });
}

export async function login(req, res, next) {
  console.log("req.body:", req.body);
  const data = loginSchema.parse(req.body);
  const email = data.email;

  const foundUser = await getUserBy("email", data.email);
  if (!foundUser) {
    return next(createHttpError[401]("Invalid login 1"));
  }

  let pwOk = await bcrypt.compare(data.password, foundUser.password);
  if (!pwOk) {
    return next(createHttpError[401]("Invalid login 2"));
  }

  const payload = { id: foundUser.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "15d",
  });
  const { password, createAt, ...userData } = foundUser;
  res.json({
    message: "Login Successful",
    token: token,
    user: userData,
  });
}

export async function logout(req, res, next) {
  res.json({ message: "Logout successful" });
}

export async function updateProfile(req, res, next) {
  try {
    const data = await updateProfileSchema.parseAsync(req.body);

    const updatedUser = await updateUserById(req.user.id, data);

    const { password, createAt, ...userData } = updatedUser;

    res.json({
      message: "Profile updated successfully",
      user: userData,
    });
  } catch (err) {
    if (err.code === "P2025") {
      return next(createHttpError[404]("User not found"));
    }
    next(err);
  }
}
