import { Router } from "express";
import * as cartController from "./cart.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { validate } from "../../middleware/validate.js";
import { addToCartSchema } from "./cart.validation.js";

const router = Router();

router.get("/", authenticate, cartController.getMyCart);

router.post("/items",authenticate,validate(addToCartSchema),cartController.addToCart);

export default router;
