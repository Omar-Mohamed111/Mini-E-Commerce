import multer from "multer";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

// // path Upload
const uploadDirectory = path.resolve("uploads");

// Create uploads directory automatically if it doesn't exist
fs.mkdirSync(uploadDirectory, { recursive: true });

const multerUpload = (allowedTypes: string[] = ["image/png", "image/jpeg"]) => {
  
  return multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, uploadDirectory);
      },

      filename: (_req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();

        cb(null, `${crypto.randomUUID()}${extension}`);
      },
    }),

    fileFilter: (_req, file, cb) => {
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Invalid file format"));
      }

      cb(null, true);
    },

    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
};

export const uploadSingleFile = (
  fieldName: string,
  allowedTypes: string[] = ["image/png", "image/jpeg"],
) => {
  return multerUpload(allowedTypes).single(fieldName);
};

export const uploadArrayFile = (fieldName: string, maxCount: number) => {
  return multerUpload().array(fieldName, maxCount);
};

export const uploadFieldFile = (fields: multer.Field[]) => {
  return multerUpload().fields(fields);
};
