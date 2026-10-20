import { NextFunction, Response, Request } from "express";
import * as authService from "./auth.service.js";

// ===========
// Register
// ===========
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await authService.createUser(req.body);
    res.status(201).json({
      message: "User Created Successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ===========
// Verify OTP
// ===========
export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await authService.verifyOTP(req.body);

    res.status(200).json({
      message: "Email Verified Successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ===========
// Login
// ===========

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user, token } = await authService.login(
      req.body.email,
      req.body.password,
    );
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Login Successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ===================================================

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.userId;

    const user = await authService.getMe(userId);

    res.status(200).json({
      message: "User Retrieved Successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ===========
// Logout
// ===========

export const logout = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(200).json({
      message: "Logout Successfully",
    });
  } catch (error) {
    next(error);
  }
};
