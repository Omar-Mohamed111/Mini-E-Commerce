import { AppError } from "../../pkg/errors/AppError.js";

export const productError = {
  productNotFound: () => new AppError("Product not found", 404),
  pageNotFound: () => new AppError("Page not found", 404),

};
