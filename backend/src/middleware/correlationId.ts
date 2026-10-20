import { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";

export const correlationId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const requestId = randomUUID();

  res.locals.correlationId = requestId ;

  res.setHeader("X-Request-ID", requestId);

  next();
};
