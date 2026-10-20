import { apiGet, apiPost } from "./client";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

export interface AuthResponse {
  message: string;
  user: AuthUser;
}

export interface MessageResponse {
  message: string;
}

// Register
export function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  return apiPost<AuthResponse>("/auth/register", data);
}

// Verify OTP
export function verifyOTP(data: { email: string; otp: string }) {
  return apiPost<AuthResponse>("/auth/verify-otp", data);
}

// Login
export function loginUser(data: { email: string; password: string }) {
  return apiPost<AuthResponse>("/auth/login", data);
}

// Get current user
export function getCurrentUser() {
  return apiGet<AuthResponse>("/auth/me");
}

// Logout
export function logoutUser() {
  return apiPost<MessageResponse>("/auth/logout");
}
