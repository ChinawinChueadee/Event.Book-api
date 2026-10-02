import createHttpError from "http-errors";
import { updateProfileSchema } from "../validations/schema.js";
import { deleteUserById, updateUserById } from "../services/user.service.js";

export const getMe = (req, res) => {
  res.json({ user: req.user });
};

export async function updateProfile(req, res, next) {
  try {
    const data = await updateProfileSchema.parseAsync(req.body);

    const updatedUser = await updateUserById(req.user.id, data);

    const {
      password,
      createdAt,
      resetToken,
      resetTokenExpiresAt,
      ...userData
    } = updatedUser;

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

// deletes the account together with its events and bookings (onDelete: Cascade)
export async function deleteMe(req, res, next) {
  try {
    await deleteUserById(req.user.id);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    if (err.code === "P2025") {
      return next(createHttpError[404]("User not found"));
    }
    next(err);
  }
}
