import { User } from "./user.model.js";

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return await User.create(data);
};


export const verifyUser = async (email: string) => {
  return await User.findOneAndUpdate(
    { email }, // filter
    { isVerified: true, otp: null, otpExpiresAt: null },
    { new: true },
  );
};

export const findUserById = async (userId: string) => {
  return await User.findById(userId);
};
