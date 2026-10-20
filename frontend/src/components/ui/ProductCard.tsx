import { Link } from "react-router-dom";
import type { Product } from "../../types";
import { formatPrice } from "../../lib";
import { Reveal } from "./Reveal";
import { SafeImage } from "./SafeImage";
import { WishlistButton } from "./WishlistButton";

/** `index` staggers the entrance of cards within a grid row. */
export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const soldOut = product.stock <= 0;
  return (
    <Reveal delay={(index % 4) * 0.09}>
      <div className="group relative">
        <Link to={`/shop/${product.id}`} className="block">
          <div className="relative aspect-[4/5] overflow-hidden bg-surface">
            {product.image ? (
              <SafeImage src={product.image} alt={product.name} className={`absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105 ${soldOut ? "opacity-60" : ""}`} />
            ) : (
              <div role="img" aria-label={product.name} className="absolute inset-0 grid place-items-center font-display text-muted">AURELLE</div>
            )}
            {soldOut && <span className="absolute left-4 top-4 border border-line bg-bg/90 px-3 py-1.5 text-sm">Sold out</span>}
          </div>
          <p className="mt-5 text-sm text-muted">{product.category}</p>
          <div className="mt-1 flex items-baseline justify-between gap-4">
            <h3 className="text-xl leading-snug transition-colors duration-300 group-hover:text-gold-text sm:text-2xl">{product.name}</h3>
            <span className="shrink-0 text-lg">{formatPrice(product.price)}</span>
          </div>
        </Link>
        <WishlistButton productId={product.id} name={product.name} className="absolute right-1 top-1 bg-bg/80 backdrop-blur" />
      </div>
    </Reveal>
  );
}
