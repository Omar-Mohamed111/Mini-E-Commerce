import { Link } from "react-router-dom";
import type { Product } from "../../types";
import { formatPrice } from "../../lib";
import { ButtonLink } from "../ui/Button";
import { SafeImage } from "../ui/SafeImage";
import { Section } from "../ui/Section";

/** Always dark, regardless of theme. Renders nothing until a product is available. */
export function Spotlight({ product: p }: { product?: Product }) {
  if (!p) return null;
  return (
    <Section className="bg-ink text-ivory">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="order-2 lg:order-1">
          <p className="text-base text-gold">{p.category}</p>
          <h2 className="mt-3 text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">{p.name}</h2>
          <p className="mt-6 line-clamp-4 max-w-lg text-lg leading-relaxed text-ivory/75">{p.description}</p>
          <p className="mt-7 text-2xl text-gold">{formatPrice(p.price)}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink to={`/shop/${p.id}`} variant="gold">View this piece</ButtonLink>
            <ButtonLink to="/shop" variant="ghost-light">Continue browsing</ButtonLink>
          </div>
        </div>
        <Link to={`/shop/${p.id}`} className="group order-1 block overflow-hidden border border-gold/30 lg:order-2" aria-label={p.name}>
          {p.image ? (
            <SafeImage src={p.image} alt={p.name} className="aspect-[4/3] w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          ) : (
            <div className="grid aspect-[4/3] place-items-center font-display text-2xl text-ivory/50">AURELLE</div>
          )}
        </Link>
      </div>
    </Section>
  );
}
