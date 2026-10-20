import { productGrid } from "../../lib";
import type { AsyncState } from "../../hooks/useAsync";
import type { ProductPage } from "../../api/products";
import { ButtonLink } from "../ui/Button";
import { ProductCard } from "../ui/ProductCard";
import { Section, SectionHeading } from "../ui/Section";
import { ErrorState, LoadingGrid } from "../ui/States";

export function Featured({ state }: { state: AsyncState<ProductPage> }) {
  const { data, error, loading, reload } = state;
  const items = data?.products.slice(0, 4) ?? [];
  if (!loading && !error && items.length === 0) return null;

  return (
    <Section>
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <SectionHeading title="Featured objects" text="A selection from across the house, each chosen to be kept." />
        <ButtonLink to="/shop" variant="outline">View all</ButtonLink>
      </div>
      {error ? <ErrorState onRetry={reload} message={error.userMessage} /> : loading ? <LoadingGrid /> : (
        <div className={productGrid}>
          {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </Section>
  );
}
