import { Heart } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";

export function WishlistButton({ productId, name, className = "" }: { productId: string; name: string; className?: string }) {
  const { has, toggle } = useWishlist();
  const on = has(productId);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
      onClick={() => toggle(productId)}
      className={`grid h-12 w-12 place-items-center transition-colors duration-300 ${on ? "text-gold-text" : "text-fg hover:text-gold-text"} ${className}`}
    >
      <Heart size={22} strokeWidth={1.5} className={`transition-transform duration-300 ${on ? "scale-110" : ""}`} fill={on ? "currentColor" : "none"} />
    </button>
  );
}
