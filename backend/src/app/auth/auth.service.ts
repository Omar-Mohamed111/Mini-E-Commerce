import { userErrors } from "./auth.errors.js";
import * as authRepsitory from "./auth.repository.js";
import bcrypt from "bcrypt";
import { expiresAt, generateOTP } from "./otp.service.js";
import { sendEmail } from "../../lib/email/email.service.js";
import jwt from "jsonwebtoken";
import { env } from "../../lib/config/env.js";

// ===========
// Register / generate OTP / send OTP
// ===========
export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const userExist = await authRepsitory.findUserByEmail(data.email);
  if (userExist) {
    throw userErrors.userAlreadyExist();
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const otp = generateOTP();
  const otpExpiration = expiresAt();

  const userData = {
    ...data,
    password: hashedPassword,
    role: "user",
    otp,
    otpExpiresAt: new Date(otpExpiration),
  };
  const user = await authRepsitory.createUser(userData);

  await sendEmail(
    data.email,
    "Verify Your Email - E-Commerce",
    `Your OTP is: ${otp}. It expires in 5 minutes.`,
  );

  const { password, otp: _otp, otpExpiresAt, ...safeUser } = user.toObject();
  return safeUser;
};

// ===========
// Verify OTP
// ===========
export const verifyOTP = async (data: { email: string; otp: string }) => {
  const user = await authRepsitory.findUserByEmail(data.email);
  if (!user) {
    throw userErrors.userNotFound();
  }

  if (user.isVerified) {
    throw userErrors.userAlreadyVerified();
  }

  if (user.otp !== data.otp) {
    throw userErrors.invalidOTP();
  }

  if (!user.otpExpiresAt || user.otpExpiresAt.getTime() < Date.now()) {
    throw userErrors.expiredOTP();
  }

  const verifiedUser = await authRepsitory.verifyUser(data.email);
  if (!verifiedUser) {
    throw userErrors.userNotFound();
  }
  const { password, otp, otpExpiresAt, ...safeUser } = verifiedUser.toObject();

  return safeUser;
};

// ===========
// Login
// ===========

export const login = async (email: string, password: string) => {
  const user = await authRepsitory.findUserByEmail(email);
  if (!user) {
    throw userErrors.userNotFound();
  }

  if (!user.isVerified) {
    throw userErrors.userNotVerified();
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    throw userErrors.invalidEmailOrPassword();
  }


  const token = jwt.sign({ userId: user._id }, env.jwtSecret, {expiresIn: "1d"});

  const { password: _password, ...safeUser } = user.toObject();

  return {
    user: safeUser,
    token,
  };
};
// ====================================================================


export const getMe = async (userId: string) => {
  const user = await authRepsitory.findUserById(userId);

  if (!user) {
    throw userErrors.userNotFound();
  }

  const { password, otp, otpExpiresAt, ...safeUser } = user.toObject();

  return safeUser;
};
