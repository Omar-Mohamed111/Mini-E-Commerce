import { ErrorRequestHandler } from "express";
import { AppError } from "./AppError.js";
import { logger } from "../logger/logger.js";

export const globalError: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      error: err.error,
    });
    return;
  }

  logger.error(
    `[Request ID: ${res.locals.correlationId}] Unexpected error`,
    err,
  );
  res.status(500).json({
    message: "Internal Server Error",
  });
};
