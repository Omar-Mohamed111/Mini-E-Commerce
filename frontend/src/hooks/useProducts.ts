import { useMemo } from "react";
import { getProduct, listProducts, PRODUCT_ID, type ListParams } from "../api/products";
import type { Product } from "../types";
import { useAsync } from "./useAsync";

export const useProductList = (params: ListParams) => useAsync((s) => listProducts(params, s), JSON.stringify(params));

/** `data` is the product, or null when it does not exist (check `error` for failures). */
export const useProduct = (id: string) => useAsync((s) => getProduct(id, s), id);

/** Loads several products by id. Missing ids are reported in `missing`; prices always come from the API. */
export function useProductsByIds(ids: string[]) {
  const key = [...new Set(ids)].sort().join(",");
  const state = useAsync(async (signal) => {
    const unique = key ? key.split(",").filter((id) => PRODUCT_ID.test(id)) : [];
    const results = await Promise.all(unique.map(async (id) => [id, await getProduct(id, signal)] as const));
    const byId: Record<string, Product> = {};
    const missing: string[] = [];
    for (const [id, p] of results) (p ? (byId[id] = p) : missing.push(id));
    return { byId, missing };
  }, key);
  return useMemo(() => ({ ...state, byId: state.data?.byId ?? {}, missing: state.data?.missing ?? [] }), [state]);
}
