import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PRODUCT_ID } from "../api/products";

const KEY = "aurelle-wishlist";

function load(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[];
    return parsed.filter((id) => PRODUCT_ID.test(id));
  } catch {
    return [];
  }
}

interface WishlistValue { ids: string[]; has: (id: string) => boolean; toggle: (id: string) => void; remove: (id: string) => void }
const WishlistContext = createContext<WishlistValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch { /* ignore */ }
  }, [ids]);

  const toggle = useCallback((id: string) => setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])), []);
  const remove = useCallback((id: string) => setIds((cur) => cur.filter((x) => x !== id)), []);
  const value = useMemo(() => ({ ids, has: (id: string) => ids.includes(id), toggle, remove }), [ids, toggle, remove]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
