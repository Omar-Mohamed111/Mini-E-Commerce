import {
  validate,
  validateQuery,
  validateParams,
} from "../../middleware/validate.js";
import * as productController from "./product.controller.js";
import express from "express";
import {
  productIdSchema,
  ProductSchema,
  updateProductSchema,
} from "./product.validation.js";
import { querySchema } from "./product.query.validation.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { uploadSingleFile } from "../../lib/media/multer.js";
import { fileValidation } from "../../lib/media/file.validation.js";
const router = express.Router();

// ========================================================================================

router.get("/", validateQuery(querySchema), productController.getAllProducts);

router.post(
  "/",
  authenticate,
  authorize,
  uploadSingleFile("image"),
  fileValidation(),
  validate(ProductSchema),
  productController.createProduct,
);

router.get(
  "/:id",
  validateParams(productIdSchema),
  productController.getProductById,
);

router.patch(
  "/:id",
  authenticate,
  authorize,
  validateParams(productIdSchema),
  uploadSingleFile("image"),
  fileValidation(undefined, false),
  validate(updateProductSchema),
  productController.updateProductById,
);

router.delete(
  "/:id",
  authenticate,
  authorize,
  validateParams(productIdSchema),
  productController.deleteProductById,
);

// ========================================================================================

export default router;
