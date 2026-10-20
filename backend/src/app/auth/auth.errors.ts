import { AppError } from "../../pkg/errors/AppError.js";

export const userErrors = {
  userAlreadyExist: () => new AppError("User Already Exist", 409),

  userNotFound: () => new AppError("User Not Found", 404),

  userAlreadyVerified: () => new AppError("User Already Verified", 400),

  invalidOTP: () => new AppError("Invalid OTP", 400),

  expiredOTP: () => new AppError("OTP Expired", 400),

  invalidEmailOrPassword: () => new AppError("Invalid Email Or Password", 400),

  userNotVerified: () => new AppError("User Not Verified", 400),
};
