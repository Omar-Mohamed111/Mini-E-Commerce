
export interface Product {
  id: string; // backend `_id`
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string; // backend category string, used verbatim for filtering
  categorySlug: string;
  image: string | null; // absolute or proxied URL, null when the product has no image
}

export interface Category {
  slug: string;
  label: string;
  count: number;
  image: string | null;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

/** Sorting supported by the backend: ascending or descending price. */
export type SortKey = "price" | "-price";
export type ThemeMode = "system" | "light" | "dark";
