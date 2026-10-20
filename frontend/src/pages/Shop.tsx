import { useSearchParams } from "react-router-dom";
import { useCatalog } from "../context/CatalogContext";
import { ProductListing } from "../components/shop/ProductListing";
import { container } from "../components/ui/Section";

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const { categories, bySlug } = useCatalog();
  const slug = params.get("category");
  const category = bySlug(slug);

  const choose = (next: string | null) => {
    const p = new URLSearchParams(params);
    p.delete("page");
    if (next) p.set("category", next); else p.delete("category");
    setParams(p, { replace: true });
  };

  const tabs = [{ slug: null as string | null, label: "All" }, ...categories];

  return (
    <div className={`${container} py-16 sm:py-24`}>
      <h1 className="text-5xl sm:text-6xl lg:text-7xl">{category?.label ?? "The collection"}</h1>
      {categories.length > 0 && (
        <div role="group" aria-label="Filter by category" className="mt-10 flex flex-wrap gap-x-6 border-y border-line py-3">
          {tabs.map((c) => (
            <button key={c.slug ?? "all"} aria-pressed={(slug ?? null) === c.slug || (!category && c.slug === null)} onClick={() => choose(c.slug)}
              className={`min-h-12 border-b-2 text-base transition-colors duration-300 ${(category?.slug ?? null) === c.slug ? "border-gold text-fg" : "border-transparent text-muted hover:text-fg"}`}>
              {c.label}
            </button>
          ))}
        </div>
      )}
      <div className="mt-10">
        {/* Keyed so changing category resets listing state. An unknown ?category= shows the full catalogue. */}
        <ProductListing key={category?.slug ?? "all"} category={category} />
      </div>
    </div>
  );
}
