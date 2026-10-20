import { NextFunction, Request, Response } from "express";
import { User } from "../app/auth/user.model.js";

export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized - User Not Found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden - Admin Access Required",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
