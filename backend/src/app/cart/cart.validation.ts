import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Product ID" }),
  quantity: z.number().int().min(1, { message: "Quantity must be at least 1" }),
});

