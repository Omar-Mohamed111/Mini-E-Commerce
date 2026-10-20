import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.email.user,
    pass: env.email.pass,
  },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  await transporter.sendMail({
    from: env.email.user,
    to,
    subject,
    text,
  });
};
