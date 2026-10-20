import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib";
import { ButtonLink } from "../components/ui/Button";
import { SafeImage } from "../components/ui/SafeImage";
import { EmptyState, ErrorState } from "../components/ui/States";
import { container } from "../components/ui/Section";

export default function Cart() {
  const { lines, subtotal, count, pricing, error, ready, reload, setQty, remove } = useCart();

  if (lines.length === 0) {
    return (
      <div className={`${container} py-24`}>
        <EmptyState title="Your cart is empty" text="Pieces you add will appear here." actionLabel="Start shopping" to="/shop" />
      </div>
    );
  }
  if (error && !pricing) return <div className={`${container} py-24`}><ErrorState onRetry={reload} message={error.userMessage} /></div>;

  return (
    <div className={`${container} py-16 sm:py-24`}>
      <h1 className="text-5xl sm:text-6xl">Your cart</h1>
      <div className="mt-12 grid gap-14 lg:grid-cols-[1fr_420px] lg:gap-20">
        <ul className="border-t border-line" aria-busy={pricing}>
          {lines.map(({ productId, product, quantity, maxQty }) => (
            <li key={productId} className="flex gap-5 border-b border-line py-8 sm:gap-8">
              {pricing && !product ? (
                <div className="flex w-full animate-pulse gap-5" role="status" aria-label="Loading item"><div className="aspect-[4/5] w-28 bg-surface sm:w-40" /><div className="h-7 w-1/2 bg-surface" /></div>
              ) : !product ? (
                <div className="flex w-full items-center justify-between gap-4">
                  <p className="text-lg text-muted">This item is no longer available.</p>
                  <button onClick={() => remove(productId)} className="inline-flex min-h-12 items-center gap-2 text-base hover:text-gold-text"><Trash2 size={18} strokeWidth={1.5} /> Remove</button>
                </div>
              ) : (
                <>
                  <Link to={`/shop/${product.id}`} className="w-28 shrink-0 sm:w-40">
                    {product.image ? <SafeImage src={product.image} alt={product.name} className="aspect-[4/5] w-full object-cover" /> : <div className="grid aspect-[4/5] w-full place-items-center bg-surface font-display text-muted">AURELLE</div>}
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex justify-between gap-4">
                      <Link to={`/shop/${product.id}`} className="font-display text-xl leading-snug hover:text-gold-text sm:text-2xl">{product.name}</Link>
                      <span className="shrink-0 text-lg">{product.stock > 0 ? formatPrice(product.price * quantity) : "—"}</span>
                    </div>
                    <p className="mt-1 text-base text-muted">{product.category} · {formatPrice(product.price)} each</p>
                    {product.stock <= 0 && <p role="alert" className="mt-2 text-base text-gold-text">Sold out. Remove it to continue.</p>}
                    {product.stock > 0 && product.stock <= 5 && <p className="mt-2 text-base text-muted">Only {product.stock} available</p>}
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                      {product.stock > 0 ? (
                        <div className="inline-flex items-center border border-line" role="group" aria-label={`Quantity for ${product.name}`}>
                          <button className="grid h-12 w-12 place-items-center" aria-label="Decrease quantity" onClick={() => setQty(productId, quantity - 1)}><Minus size={16} /></button>
                          <span className="w-9 text-center text-lg">{quantity}</span>
                          <button className="grid h-12 w-12 place-items-center disabled:opacity-40" aria-label="Increase quantity" disabled={quantity >= maxQty} onClick={() => setQty(productId, quantity + 1)}><Plus size={16} /></button>
                        </div>
                      ) : <span />}
                      <button onClick={() => remove(productId)} className="inline-flex min-h-12 items-center gap-2 text-base text-muted hover:text-gold-text">
                        <Trash2 size={18} strokeWidth={1.5} /> Remove
                      </button>
                    </div>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        <aside className="h-fit border border-line bg-surface p-8 sm:p-10 lg:sticky lg:top-28" aria-labelledby="summary">
          <h2 id="summary" className="text-3xl">Order summary</h2>
          <dl className="mt-8 space-y-4 text-lg">
            <div className="flex justify-between"><dt className="text-muted">Items</dt><dd>{count}</dd></div>
            <div className="flex justify-between border-t border-line pt-4 text-xl"><dt>Subtotal</dt><dd>{pricing ? "…" : formatPrice(subtotal)}</dd></div>
          </dl>
          <p className="mt-4 text-base text-muted">Prices are confirmed with the store. Shipping and taxes are calculated at checkout.</p>
          {ready ? <ButtonLink to="/checkout" className="mt-8 w-full">Proceed to checkout</ButtonLink> : (
            <p className="mt-8 border border-line p-4 text-base text-muted" role="status">{pricing ? "Checking availability…" : "Remove unavailable items to continue."}</p>
          )}
          <Link to="/shop" className="mt-5 block text-center text-base text-muted underline-offset-4 hover:text-fg hover:underline">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}
