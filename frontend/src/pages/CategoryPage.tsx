import { Link, useParams, type To } from "react-router-dom";
import type { CSSProperties } from "react";
import { useCatalog } from "../context/CatalogContext";
import { ProductListing } from "../components/shop/ProductListing";
import { SafeImage } from "../components/ui/SafeImage";
import { ErrorState } from "../components/ui/States";
import { container } from "../components/ui/Section";
import NotFound from "./NotFound";

export default function CategoryPage() {
  const { id } = useParams();
  const { categories, bySlug, loading, error, reload } = useCatalog();
  const category = bySlug(id);

  if (loading) return <div role="status" aria-label="Loading category" className="min-h-[60vh] animate-pulse bg-surface/50" />;
  if (error) return <div className={`${container} py-24`}><ErrorState onRetry={reload} message={error.userMessage} /></div>;
  if (!category) return <NotFound />;

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-ivory">
        {category.image && <SafeImage src={category.image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-45" />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/50 to-transparent" />
        <div className={`${container} py-24 sm:py-36`}>
          <p className="rise text-base text-gold">AURELLE</p>
          <h1 className="rise mt-3 text-5xl sm:text-6xl lg:text-8xl" style={{ "--d": "0.1s" } as CSSProperties}>{category.label}</h1>
          <p className="rise mt-6 max-w-xl text-lg text-ivory/85 sm:text-xl" style={{ "--d": "0.25s" } as CSSProperties}>
            {category.count} {category.count === 1 ? "piece" : "pieces"} in this department.
          </p>
        </div>
      </section>

      <div className={`${container} py-16 sm:py-24`}>
        <nav aria-label="Departments" className="mb-10 flex flex-wrap gap-x-6 border-b border-line pb-3">
          {categories.map((c) => (
            <Link key={c.slug} to={`/category/${c.slug}` as To} aria-current={c.slug === category.slug ? "page" : undefined}
              className={`inline-flex min-h-12 items-center border-b-2 text-base transition-colors duration-300 ${c.slug === category.slug ? "border-gold" : "border-transparent text-muted hover:text-fg"}`}>
              {c.label}
            </Link>
          ))}
        </nav>
        <ProductListing key={category.slug} category={category} />
      </div>
    </>
  );
}
