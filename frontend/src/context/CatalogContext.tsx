import { createContext, useContext, useMemo, type ReactNode } from "react";
import { listAllProducts } from "../api/products";
import { useAsync } from "../hooks/useAsync";
import type { Category } from "../types";
import type { ApiError } from "../api/client";

interface CatalogValue {
  categories: Category[];
  loading: boolean;
  error: ApiError | null;
  reload: () => void;
  bySlug: (slug: string | null | undefined) => Category | undefined;
}

const CatalogContext = createContext<CatalogValue | null>(null);

/** The API has no categories endpoint, so categories are derived from the real catalogue. */
export function CatalogProvider({ children }: { children: ReactNode }) {
  const { data, error, loading, reload } = useAsync((s) => listAllProducts(s), "catalog");

  const value = useMemo<CatalogValue>(() => {
    const map = new Map<string, Category>();
    for (const p of data ?? []) {
      if (!p.categorySlug) continue;
      const c = map.get(p.categorySlug) ?? { slug: p.categorySlug, label: p.category, count: 0, image: null };
      c.count += 1;
      c.image ??= p.image;
      map.set(p.categorySlug, c);
    }
    const categories = [...map.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
    return { categories, loading, error, reload, bySlug: (slug) => categories.find((c) => c.slug === slug) };
  }, [data, loading, error, reload]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used inside CatalogProvider");
  return ctx;
}
