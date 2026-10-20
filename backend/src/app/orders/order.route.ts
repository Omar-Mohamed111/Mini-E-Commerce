import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { createMyOrder } from "./order.controller.js";

const router = Router();

router.post("/checkout", authenticate, createMyOrder);

export default router;
