import "dotenv/config";
import { sendEmail } from "./src/lib/email/email.service.js";

const testEmail = async () => {
  await sendEmail(
    "om893177@gmail.com",
    "Mini E-Commerce Test",
    "Hello! Your email service is working successfully.",
  );
};

testEmail();
