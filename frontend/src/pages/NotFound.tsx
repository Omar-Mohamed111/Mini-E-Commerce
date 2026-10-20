import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useCatalog } from "../context/CatalogContext";
import { ButtonLink } from "../components/ui/Button";
import { container } from "../components/ui/Section";

export default function NotFound() {
  const { categories } = useCatalog();
  return (
    <div className={`${container} py-24 text-center sm:py-36`}>
      <p className="rise font-display text-[7rem] leading-none text-gold-text sm:text-[11rem]" aria-hidden>404</p>
      <h1 className="rise mt-4 text-4xl sm:text-6xl" style={{ "--d": "0.1s" } as CSSProperties}>This page has gone missing</h1>
      <p className="rise mx-auto mt-6 max-w-lg text-lg text-muted sm:text-xl" style={{ "--d": "0.2s" } as CSSProperties}>
        The address may be mistyped or the piece may no longer be available. Try one of the departments instead.
      </p>
      <div className="rise mt-10 flex flex-wrap justify-center gap-4" style={{ "--d": "0.3s" } as CSSProperties}>
        <ButtonLink to="/">Go to the homepage</ButtonLink>
        <ButtonLink to="/shop" variant="outline">Shop all</ButtonLink>
      </div>
      <nav aria-label="Departments" className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-2">
        {categories.map((c) => <Link key={c.slug} to={`/category/${c.slug}`} className="py-2 text-lg text-muted hover:text-gold-text">{c.label}</Link>)}
      </nav>
    </div>
  );
}
