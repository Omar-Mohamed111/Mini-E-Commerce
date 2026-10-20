import { Link } from "react-router-dom";
import { useCatalog } from "../../context/CatalogContext";
import { SafeImage } from "../ui/SafeImage";
import { Section, SectionHeading } from "../ui/Section";
import { ErrorState } from "../ui/States";

/** Column spans on the 6-column desktop grid so any number of categories fills its rows. */
function span(i: number, n: number) {
  if (n === 1) return "lg:col-span-6";
  if (n === 2 || n === 4) return "lg:col-span-3";
  if (n === 3 || n >= 6) return "lg:col-span-2";
  return i < 2 ? "lg:col-span-3" : "lg:col-span-2"; // n === 5
}

export function CategoryTiles() {
  const { categories, loading, error, reload } = useCatalog();
  if (!loading && !error && categories.length === 0) return null;
  const tiles = categories.slice(0, 6);

  return (
    <Section className="!pt-4" id="categories">
      <SectionHeading title="Shop by category" text="Every department held to the same standard of craft." />
      <div className="mt-14">
        {error ? <ErrorState onRetry={reload} message={error.userMessage} /> : loading ? (
          <div role="status" aria-label="Loading categories" className="grid animate-pulse gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => <div key={i} className="aspect-[4/3] bg-surface" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-6 lg:gap-6">
            {tiles.map((c, i) => (
              <Link key={c.slug} to={`/category/${c.slug}`}
                className={`group relative block aspect-[4/3] overflow-hidden bg-surface ${i === 0 && tiles.length % 2 === 1 ? "min-[480px]:col-span-2 min-[480px]:aspect-[16/10]" : "min-[480px]:aspect-[4/5]"} ${span(i, tiles.length)} ${tiles.length <= 4 ? "lg:aspect-[4/3]" : i < 2 ? "lg:aspect-[4/3]" : "lg:aspect-[4/5]"}`}>
                {c.image ? <SafeImage src={c.image} alt="" className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" /> : <div className="h-full w-full bg-charcoal" />}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-ivory sm:p-8">
                  <h3 className="text-3xl sm:text-4xl">{c.label}</h3>
                  <p className="mt-2 text-base text-ivory/85">{c.count} {c.count === 1 ? "piece" : "pieces"}</p>
                  <span className="mt-4 inline-block border-b border-gold pb-1 text-base transition-colors group-hover:text-gold">Shop {c.label.toLowerCase()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
