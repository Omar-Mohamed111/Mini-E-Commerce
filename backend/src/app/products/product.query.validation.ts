import z from "zod";

export const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().positive().default(10),

  sort: z.enum(["price", "-price"]).default("price"),

  category: z.string().default(""),

  search: z.string().default(""),
});
