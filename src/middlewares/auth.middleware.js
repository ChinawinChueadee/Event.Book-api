import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { getUserBy } from "../services/user.service.js";

export default async function (req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw createHttpError[401]("Unautorization 1");
  }
  const token = authorization.split(" ")[1];
  if (!token) {
    throw createHttpError[401]("Unautorization 2");
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);

  const foundUser = await getUserBy("id", payload.id);
  if (!foundUser) {
    throw createHttpError[401]("Unautorization 3");
  }

  const { password, createAt, ...usesrData } = foundUser;
  req.user = usesrData;
  next();
}
