import { useEffect } from "react";
import { X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useProductsByIds } from "../hooks/useProducts";
import { productGrid } from "../lib";
import { Button } from "../components/ui/Button";
import { ProductCard } from "../components/ui/ProductCard";
import { EmptyState, ErrorState, LoadingGrid } from "../components/ui/States";
import { container } from "../components/ui/Section";

export default function Wishlist() {
  const { ids, remove } = useWishlist();
  const { add } = useCart();
  const { byId, missing, loading, error, reload } = useProductsByIds(ids);
  const saved = ids.flatMap((id) => (byId[id] ? [byId[id]] : []));

  // Products deleted from the catalogue are dropped from the wishlist.
  useEffect(() => { missing.forEach(remove); }, [missing, remove]);

  return (
    <div className={`${container} py-16 sm:py-24`}>
      <h1 className="text-5xl sm:text-6xl">Wishlist</h1>
      <p className="mt-4 text-lg text-muted">Pieces you’ve saved, kept on this device.</p>
      <div className="mt-14">
        {ids.length === 0 ? (
          <EmptyState title="Your wishlist is empty" text="Tap the heart on any piece to save it here." actionLabel="Browse the collection" to="/shop" />
        ) : error ? <ErrorState onRetry={reload} message={error.userMessage} /> : loading && saved.length === 0 ? <LoadingGrid count={Math.min(ids.length, 4)} /> : (
          <div className={productGrid}>
            {saved.map((p, i) => (
              <div key={p.id}>
                <ProductCard product={p} index={i} />
                <div className="mt-4 flex gap-3">
                  <Button className="flex-1" disabled={p.stock <= 0} onClick={() => { add(p.id, 1); remove(p.id); }}>{p.stock <= 0 ? "Sold out" : "Move to cart"}</Button>
                  <button onClick={() => remove(p.id)} aria-label={`Remove ${p.name} from wishlist`} className="grid h-14 w-14 place-items-center border border-line hover:border-fg"><X size={20} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
