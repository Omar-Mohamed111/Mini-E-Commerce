import type { Product } from "../types";
import { assetUrl } from "./client";

/** Shape returned by the backend (Mongoose product document). */
export interface ProductDto {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string | null;
  createdAt?: string;
}

export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/** The one place where backend fields are mapped to frontend types (`_id` -> `id`, image paths -> URLs). */
export function toProduct(dto: ProductDto): Product {
  return {
    id: dto._id,
    name: dto.name,
    description: dto.description,
    price: Number(dto.price),
    stock: Number(dto.stock),
    category: dto.category,
    categorySlug: slugify(dto.category),
    image: assetUrl(dto.image),
  };
}
