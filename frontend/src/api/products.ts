import type { Product, SortKey } from "../types";
import { ApiError, apiGet, apiPost, apiPatch, apiDelete } from "./client";
import { toProduct, type ProductDto } from "./mappers";

export interface Pagination {
  totalProducts: number;
  currentPage: number;
  limit: number;
  totalPages: number;
}
export interface ProductPage {
  products: Product[];
  pagination: Pagination;
}
export interface ListParams {
  page?: number;
  limit?: number;
  sort?: SortKey;
  category?: string;
  search?: string;
}

export const PRODUCT_ID = /^[0-9a-fA-F]{24}$/;
const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * GET /products. The backend treats `search` as a raw regex, so it is escaped here
 * to make it a literal, case-insensitive name search.
 * Note: the backend answers 404 "Page not found" when a result set is empty, which is mapped to an empty page.
 */
export async function listProducts(
  p: ListParams = {},
  signal?: AbortSignal,
): Promise<ProductPage> {
  const page = p.page ?? 1;
  const limit = p.limit ?? 12;
  try {
    const data = await apiGet<{
      products: ProductDto[];
      pagination: Pagination;
    }>(
      "/products",
      {
        page,
        limit,
        sort: p.sort ?? "price",
        category: p.category,
        search: p.search?.trim() ? escapeRegex(p.search.trim()) : undefined,
      },
      signal,
    );
    return {
      products: data.products.map(toProduct),
      pagination: data.pagination,
    };
  } catch (e) {
    if (e instanceof ApiError && e.kind === "not-found") {
      return {
        products: [],
        pagination: {
          totalProducts: 0,
          currentPage: page,
          limit,
          totalPages: 0,
        },
      };
    }
    throw e;
  }
}

/** GET /products/:id. Resolves null when the product does not exist. */
export async function getProduct(
  id: string,
  signal?: AbortSignal,
): Promise<Product | null> {
  if (!PRODUCT_ID.test(id)) return null; // backend would answer 400 for malformed ids
  try {
    return toProduct(
      await apiGet<ProductDto>(`/products/${id}`, undefined, signal),
    );
  } catch (e) {
    if (e instanceof ApiError && e.kind === "not-found") return null;
    throw e;
  }
}

/** Walks the paginated list (limit 100, up to 5 pages) so categories can be derived; the API has no categories endpoint. */
export async function listAllProducts(
  signal?: AbortSignal,
): Promise<Product[]> {
  const all: Product[] = [];
  for (let page = 1; page <= 5; page++) {
    const r = await listProducts({ page, limit: 100 }, signal);
    all.push(...r.products);
    if (page >= r.pagination.totalPages) break;
  }
  return all;
}
export interface ProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: File | null;
}

function toProductFormData(input: Partial<ProductInput>): FormData {
  const formData = new FormData();

  if (input.name !== undefined) {
    formData.append("name", input.name);
  }

  if (input.description !== undefined) {
    formData.append("description", input.description);
  }

  if (input.price !== undefined) {
    formData.append("price", String(input.price));
  }

  if (input.stock !== undefined) {
    formData.append("stock", String(input.stock));
  }

  if (input.category !== undefined) {
    formData.append("category", input.category);
  }

  if (input.image) {
    formData.append("image", input.image);
  }

  return formData;
}

/** POST /products. Creates a product and optionally uploads its image. */
export async function createProduct(input: ProductInput): Promise<Product> {
  const formData = toProductFormData(input);

  const product = await apiPost<ProductDto>("/products", formData);

  return toProduct(product);
}

/** PATCH /products/:id. Updates supplied fields and optionally replaces the image. */
export async function updateProduct(
  id: string,
  input: Partial<ProductInput>,
): Promise<Product> {
  if (!PRODUCT_ID.test(id)) {
    throw new ApiError("invalid", 400, "Invalid product ID");
  }

  const formData = toProductFormData(input);

  const product = await apiPatch<ProductDto>(`/products/${id}`, formData);

  return toProduct(product);
}

/** DELETE /products/:id. Deletes a product. */
export async function deleteProduct(id: string): Promise<Product> {
  if (!PRODUCT_ID.test(id)) {
    throw new ApiError("invalid", 400, "Invalid product ID");
  }

  const product = await apiDelete<ProductDto>(`/products/${id}`);

  return toProduct(product);
}
