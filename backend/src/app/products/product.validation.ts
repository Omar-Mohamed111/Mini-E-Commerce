import z from "zod";

export const ProductSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),

  description: z.string().trim().min(1, "Product description is required"),

  price: z.coerce.number().min(0, "Price cannot be negative"),

  stock: z.coerce
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock must be a non-negative integer"),

  category: z.string().trim().min(1, "Product category is required"),
});

export const updateProductSchema = ProductSchema.partial();

export const productIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
});
