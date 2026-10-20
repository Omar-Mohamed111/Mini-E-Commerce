import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { PRODUCT_ID } from "../api/products";
import { useProductsByIds } from "../hooks/useProducts";
import type { ApiError } from "../api/client";
import type { CartItem, Product } from "../types";

// Guest cart, kept on this device. Only ids and quantities are stored; price,
// name and stock always come from the API, so a stored price can never be stale.
const KEY = "aurelle-cart-v3";
export const MAX_QTY = 10;

type Action =
  | { type: "add"; productId: string; quantity: number }
  | { type: "set"; productId: string; quantity: number }
  | { type: "remove"; productId: string }
  | { type: "clear" };

function reducer(state: CartItem[], a: Action): CartItem[] {
  switch (a.type) {
    case "add":
      return state.some((i) => i.productId === a.productId)
        ? state.map((i) => (i.productId === a.productId ? { ...i, quantity: Math.min(i.quantity + a.quantity, MAX_QTY) } : i))
        : [...state, { productId: a.productId, quantity: Math.min(a.quantity, MAX_QTY) }];
    case "set":
      return a.quantity < 1
        ? state.filter((i) => i.productId !== a.productId)
        : state.map((i) => (i.productId === a.productId ? { ...i, quantity: Math.min(a.quantity, MAX_QTY) } : i));
    case "remove":
      return state.filter((i) => i.productId !== a.productId);
    case "clear":
      return [];
  }
}

function load(): CartItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]") as CartItem[];
    return parsed.filter((i) => PRODUCT_ID.test(i.productId) && Number.isInteger(i.quantity) && i.quantity > 0);
  } catch {
    return [];
  }
}

export interface CartLine {
  productId: string;
  quantity: number;
  /** null when the product no longer exists in the catalogue. */
  product: Product | null;
  /** Largest quantity the customer may hold (stock-aware). */
  maxQty: number;
}

interface CartValue {
  lines: CartLine[];
  count: number;
  /** Sum of API prices for available lines. */
  subtotal: number;
  /** True while product data is loading. */
  pricing: boolean;
  /** Set when product data could not be loaded. */
  error: ApiError | null;
  /** True when every line is available and priced, so the order can be reviewed. */
  ready: boolean;
  reload: () => void;
  add: (productId: string, quantity?: number) => void;
  setQty: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, undefined, load);
  const { byId, missing, loading, error, reload } = useProductsByIds(items.map((i) => i.productId));

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* storage unavailable */ }
  }, [items]);

  // Reconcile with live stock: never hold more than is available.
  useEffect(() => {
    for (const i of items) {
      const p = byId[i.productId];
      if (p && p.stock > 0 && i.quantity > p.stock) dispatch({ type: "set", productId: i.productId, quantity: p.stock });
    }
  }, [items, byId]);

  const value = useMemo<CartValue>(() => {
    const lines: CartLine[] = items.map((i) => {
      const product = byId[i.productId] ?? null;
      return { productId: i.productId, quantity: i.quantity, product, maxQty: product ? Math.max(0, Math.min(MAX_QTY, product.stock)) : MAX_QTY };
    });
    const available = lines.filter((l) => l.product && l.product.stock > 0);
    const loaded = !loading && !error;
    return {
      lines,
      count: items.reduce((s, i) => s + i.quantity, 0),
      subtotal: available.reduce((s, l) => s + l.quantity * l.product!.price, 0),
      pricing: loading,
      error,
      ready: loaded && lines.length > 0 && available.length === lines.length && missing.length === 0,
      reload,
      add: (productId, quantity = 1) => dispatch({ type: "add", productId, quantity }),
      setQty: (productId, quantity) => dispatch({ type: "set", productId, quantity }),
      remove: (productId) => dispatch({ type: "remove", productId }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [items, byId, missing, loading, error, reload]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
