import crypto from "crypto";

export const generateOTP = (): string => {
  return crypto.randomInt(100000, 1000000).toString();
};

export const expiresAt = (): number => {
  return Date.now() + 5 * 60 * 1000;
};
