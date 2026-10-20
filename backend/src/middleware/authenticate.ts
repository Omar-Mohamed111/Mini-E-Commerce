import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { env } from "../lib/config/env.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // // Get Token
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized - Token Not Found",
    });
  }

  // // verify Token
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    if (typeof decoded === "string" || typeof decoded.userId !== "string") {
      return res.status(401).json({
        message: "Invalid Token Payload",
      });
    }

    res.locals.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or Expired Token",
    });
  }
};
