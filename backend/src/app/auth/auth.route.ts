import express from "express"
import * as authController from "./auth.controller.js"
import { validate } from "../../middleware/validate.js"
import { loginSchema, registerSchema, verifyOTPSchema } from "./auth.validation.js"
import { authenticate } from "../../middleware/authenticate.js"

const router = express.Router()



router.post("/register", validate(registerSchema), authController.createUser)

router.post("/verify-otp", validate(verifyOTPSchema), authController.verifyOTP)

router.post("/login", validate(loginSchema), authController.login)

router.get("/me", authenticate, authController.getMe);

router.post("/logout",authenticate, authController.logout);


export default router