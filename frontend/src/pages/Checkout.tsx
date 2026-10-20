import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../api/auth";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib";
import { Button, ButtonLink } from "../components/ui/Button";
import { EmptyState } from "../components/ui/States";
import { container } from "../components/ui/Section";

/** Order review only. No payment provider is connected, and nothing is submitted. */
export default function Checkout() {
  const { lines, subtotal, ready, pricing } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // No need to require login if the cart is empty.
    if (lines.length === 0) return;

    let cancelled = false;

    getCurrentUser().catch(() => {
      if (!cancelled) {
        navigate("/login", {
          replace: true,
          state: { from: "/checkout" },
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [lines.length, navigate]);

  if (lines.length === 0 || (!ready && !pricing)) {
    return (
      <div className={`${container} py-24`}>
        <EmptyState
          title="Nothing to check out"
          text="Your cart is empty or contains unavailable items."
          actionLabel="Back to your cart"
          to="/cart"
        />
      </div>
    );
  }

  return (
    <div className={`${container} py-16 sm:py-24`}>
      <h1 className="text-5xl sm:text-6xl">Checkout</h1>

      <div className="mt-12 grid gap-14 lg:grid-cols-[1fr_420px] lg:gap-20">
        <div>
          <div role="status" className="border border-gold/60 p-8">
            <h2 className="text-3xl">Payments aren’t connected yet</h2>

            <p className="mt-4 text-lg leading-relaxed text-muted">
              Your items and prices come live from the store, but placing an
              order isn’t available here yet. No order is placed and no payment
              details are collected.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink to="/cart" variant="outline">
                Back to cart
              </ButtonLink>
              <Button disabled>Place order</Button>
            </div>
          </div>
        </div>

        <aside
          className="h-fit border border-line bg-surface p-8 sm:p-10"
          aria-labelledby="review"
        >
          <h2 id="review" className="text-3xl">
            Your order
          </h2>

          <ul className="mt-6 divide-y divide-line">
            {lines.flatMap(({ productId, product, quantity }) =>
              product
                ? [
                    <li
                      key={productId}
                      className="flex justify-between gap-4 py-4 text-lg"
                    >
                      <div>
                        <Link
                          to={`/shop/${product.id}`}
                          className="hover:text-gold-text"
                        >
                          {product.name}
                        </Link>
                        <p className="text-base text-muted">Qty {quantity}</p>
                      </div>

                      <span>{formatPrice(product.price * quantity)}</span>
                    </li>,
                  ]
                : [],
            )}
          </ul>

          <div className="mt-4 flex justify-between border-t border-line pt-5 text-xl">
            <span>Subtotal</span>
            <span>{pricing ? "…" : formatPrice(subtotal)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
