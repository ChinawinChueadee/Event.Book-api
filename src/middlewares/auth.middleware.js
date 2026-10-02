import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { getUserBy } from "../services/user.service.js";

export default async function (req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw createHttpError[401]("Unauthorized");
  }
  const token = authorization.split(" ")[1];
  if (!token) {
    throw createHttpError[401]("Unauthorized");
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);

  const foundUser = await getUserBy("id", payload.id);
  if (!foundUser) {
    throw createHttpError[401]("Unauthorized");
  }

  const { password, createdAt, ...userData } = foundUser;
  req.user = userData;
  next();
}
