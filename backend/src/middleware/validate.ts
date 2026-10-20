import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { logger } from "../pkg/logger/logger.js";

// Validate request body
export const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      logger.warn(
        `[Request ID: ${res.locals.correlationId}] Validation Failed: ${JSON.stringify(result.error.issues)}`,
      );
      res.status(400).json({
        message: result.error.issues[0]?.message ?? "Validation Error",
      });

      return;
    }

    req.body = result.data;

    next();
  };
};

// ==========================================================================

// Validate query parameters
export const validateQuery = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      logger.warn(
        `[Request ID: ${res.locals.correlationId}] Validation Failed: ${JSON.stringify(result.error.issues)}`,
      );
      res.status(400).json({
        message: result.error.issues[0]?.message ?? "Validation Error",
      });

      return;
    }

    res.locals.validatedQuery = result.data;

    next();
  };
};

// ==========================================================================

// // validateParams
export const validateParams = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      logger.warn(
        `[Request ID: ${res.locals.correlationId}] Validation Failed: ${JSON.stringify(result.error.issues)}`,
      );
      res.status(400).json({
        message: result.error.issues[0]?.message ?? "Invalid Params",
      });

      return;
    }

    res.locals.validatedParams = result.data;
    next();
  };
};
