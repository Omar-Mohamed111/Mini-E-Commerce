import { useEffect, useState, type CSSProperties } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, Minus, Plus } from "lucide-react";
import { MAX_QTY, useCart } from "../context/CartContext";
import { useProduct } from "../hooks/useProducts";
import { formatPrice } from "../lib";
import { Button } from "../components/ui/Button";
import { SafeImage } from "../components/ui/SafeImage";
import { WishlistButton } from "../components/ui/WishlistButton";
import { EmptyState, ErrorState } from "../components/ui/States";
import { container } from "../components/ui/Section";

export default function ProductDetail() {
  const { id = "" } = useParams();
  const { add } = useCart();
  const { data: product, error, loading, reload } = useProduct(id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => { setQty(1); setAdded(false); }, [id]);
  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 3000);
    return () => clearTimeout(t);
  }, [added]);

  if (error) return <div className={`${container} py-24`}><ErrorState onRetry={reload} message={error.userMessage} /></div>;
  if (loading) {
    return (
      <div role="status" aria-label="Loading product" className={`${container} grid animate-pulse gap-12 py-16 md:grid-cols-2`}>
        <div className="aspect-[4/5] bg-surface" />
        <div className="space-y-5"><div className="h-14 w-2/3 bg-surface" /><div className="h-7 w-28 bg-surface" /><div className="h-32 bg-surface" /></div>
      </div>
    );
  }
  if (!product) {
    return <div className={`${container} py-24`}><EmptyState title="Piece not found" text="This product may have moved or is no longer available." actionLabel="Back to the shop" to="/shop" /></div>;
  }

  const maxQty = Math.min(MAX_QTY, product.stock);
  const soldOut = product.stock <= 0;
  const qtyShown = Math.min(qty, Math.max(1, maxQty));

  return (
    <div className={`${container} py-12 sm:py-20`}>
      <nav aria-label="Breadcrumb" className="mb-10 text-base text-muted">
        <Link to="/shop" className="hover:text-gold-text">Shop</Link>
        <span className="mx-3" aria-hidden>/</span>
        <Link to={`/category/${product.categorySlug}`} className="hover:text-gold-text">{product.category}</Link>
      </nav>

      <div className="grid gap-12 md:grid-cols-[1.15fr_1fr] lg:gap-20">
        <div className="rise md:sticky md:top-28 md:self-start">
          {product.image ? (
            <SafeImage src={product.image} alt={product.name} loading="eager" className="aspect-[4/5] w-full bg-surface object-cover" />
          ) : (
            <div role="img" aria-label={product.name} className="grid aspect-[4/5] w-full place-items-center bg-surface font-display text-2xl text-muted">AURELLE</div>
          )}
        </div>

        <div className="rise md:pt-4" style={{ "--d": "0.15s" } as CSSProperties}>
          <p className="text-base text-muted">{product.category}</p>
          <h1 className="mt-2 text-5xl leading-[1.05] lg:text-6xl">{product.name}</h1>
          <p className="mt-5 text-3xl text-gold-text">{formatPrice(product.price)}</p>
          <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-muted">{product.description}</p>

          <p className="mt-8 text-base" role="status">
            {soldOut ? "Currently sold out" : product.stock <= 5 ? `Only ${product.stock} left` : "In stock"}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center border border-line" role="group" aria-label="Quantity">
              <button className="grid h-14 w-14 place-items-center disabled:opacity-40" aria-label="Decrease quantity" disabled={soldOut || qtyShown <= 1} onClick={() => setQty(qtyShown - 1)}><Minus size={18} /></button>
              <span className="w-10 text-center text-lg" aria-live="polite">{soldOut ? 0 : qtyShown}</span>
              <button className="grid h-14 w-14 place-items-center disabled:opacity-40" aria-label="Increase quantity" disabled={soldOut || qtyShown >= maxQty} onClick={() => setQty(qtyShown + 1)}><Plus size={18} /></button>
            </div>
            <Button className="flex-1 sm:min-w-64 sm:flex-none" disabled={soldOut} onClick={() => { add(product.id, qtyShown); setAdded(true); }}>
              {soldOut ? "Sold out" : added ? <><Check size={18} /> Added to cart</> : "Add to cart"}
            </Button>
            <WishlistButton productId={product.id} name={product.name} className="border border-line !h-14 !w-14" />
          </div>
          <p role="status" className="mt-4 min-h-7 text-base text-muted">
            {added && <>Added. <Link to="/cart" className="border-b border-gold text-fg">View your cart</Link></>}
          </p>
        </div>
      </div>
    </div>
  );
}
