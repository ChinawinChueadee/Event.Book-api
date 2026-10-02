import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import { loginSchema, registerSchema } from "../validations/schema.js";
import { createUser, getUserBy } from "../services/user.service.js";

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
  const { password, ...userData } = result;

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
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "15d",
  });
  const { password, createdAt, ...userData } = foundUser;
  res.json({
    message: "Login Successful",
    token: token,
    user: userData,
  });
}

export async function logout(req, res, next) {
  res.json({ message: "Logout successful" });
}
