import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { productGrid } from "../../lib";
import { useProductList } from "../../hooks/useProducts";
import type { Category, SortKey } from "../../types";
import { Button } from "../ui/Button";
import { Pagination } from "../ui/Pagination";
import { ProductCard } from "../ui/ProductCard";
import { EmptyState, ErrorState, LoadingGrid } from "../ui/States";

const PAGE_SIZE = 12;

/**
 * Server-driven catalogue: search, price sort and pagination are passed to GET /products
 * and kept in the URL (?q=&sort=&page=). Category comes from the parent.
 */
export function ProductListing({ category }: { category?: Category }) {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, parseInt(params.get("page") ?? "1", 10) || 1);
  const sort: SortKey = params.get("sort") === "-price" ? "-price" : "price";
  const q = params.get("q") ?? "";
  const [draft, setDraft] = useState(q);
  useEffect(() => setDraft(q), [q]);

  const { data, error, loading, reload } = useProductList({ page, limit: PAGE_SIZE, sort, category: category?.label, search: q });

  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(changes)) (v ? next.set(k, v) : next.delete(k));
    setParams(next, { replace: true });
  };

  // A page beyond the last one (e.g. a stale bookmark) falls back to page 1.
  useEffect(() => {
    if (data && data.products.length === 0 && page > 1) update({ page: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, page]);

  const submit = (e: FormEvent) => { e.preventDefault(); update({ q: draft.trim() || null, page: null }); };
  const total = data?.pagination.totalProducts ?? 0;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={submit} role="search" className="flex flex-1 gap-3 sm:max-w-lg">
          <label htmlFor="product-search" className="sr-only">Search by product name</label>
          <input id="product-search" type="search" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Search by name"
            className="min-h-12 flex-1 border border-line bg-transparent px-4 text-base text-fg placeholder:text-muted focus:border-gold" />
          <Button type="submit" className="!px-5" aria-label="Search"><Search size={18} /></Button>
        </form>
        <div className="flex items-center gap-3 text-base">
          <label htmlFor="sort" className="text-muted">Sort by</label>
          <select id="sort" value={sort} onChange={(e) => update({ sort: e.target.value === "-price" ? "-price" : null, page: null })} className="min-h-12 border border-line bg-bg px-4 text-base text-fg">
            <option value="price">Price: low to high</option>
            <option value="-price">Price: high to low</option>
          </select>
        </div>
      </div>

      <div className="mt-10">
        {error ? <ErrorState onRetry={reload} message={error.userMessage} /> : loading && !data ? <LoadingGrid count={8} /> : !data || data.products.length === 0 ? (
          q ? (
            <EmptyState title="No matches" text={`Nothing matched “${q}”. Try a different name.`} actionLabel="Clear search" to={category ? `/category/${category.slug}` : "/shop"} />
          ) : (
            <EmptyState title="Nothing here yet" text="No pieces are available in this selection." actionLabel="View all objects" to="/shop" />
          )
        ) : (
          <>
            <p className="mb-8 text-base text-muted" aria-live="polite">
              {total} {total === 1 ? "piece" : "pieces"}{q && <> matching “{q}”</>}
            </p>
            <div className={`${productGrid} transition-opacity duration-300 ${loading ? "opacity-50" : ""}`}>
              {data.products.map((p, i) => <ProductCard key={`${page}-${sort}-${p.id}`} product={p} index={i} />)}
            </div>
            <Pagination page={data.pagination.currentPage} totalPages={data.pagination.totalPages} onChange={(n) => { update({ page: n > 1 ? String(n) : null }); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
          </>
        )}
      </div>
    </div>
  );
}
