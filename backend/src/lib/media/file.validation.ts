import { fileTypeFromFile } from "file-type";
import { unlink } from "node:fs/promises";
import { AppError } from "../../pkg/errors/AppError.js";
import { Request, Response, NextFunction } from "express";

const fileValidation = (
  allowedTypes: string[] = ["image/png", "image/jpeg"],
  required: boolean = true,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const filePath = req.file?.path;

    if (!filePath) {
      if (!required) {
        return next();
      }

      return next(new AppError("File is required", 400));
    }

    try {
      const type = await fileTypeFromFile(filePath);

      if (!type || !allowedTypes.includes(type.mime)) {
        await unlink(filePath);
        return next(new AppError("Invalid file type", 400));
      }

      next();
    } catch {
      try {
        await unlink(filePath);
      } catch {
        // The file may already have been removed.
      }

      next(new AppError("Failed to validate file", 500));
    }
  };
};

export { fileValidation };
