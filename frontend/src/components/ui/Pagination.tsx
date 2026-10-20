import { ChevronLeft, ChevronRight } from "lucide-react";

/** Page window with first/last, e.g. 1 … 4 5 6 … 12. */
function windowed(current: number, total: number): (number | "gap")[] {
  const set = new Set([1, total, current - 1, current, current + 1].filter((n) => n >= 1 && n <= total));
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push("gap");
    out.push(n);
  });
  return out;
}

export function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  const btn = "grid h-12 min-w-12 place-items-center border px-3 text-base transition-colors duration-300";
  return (
    <nav aria-label="Pagination" className="mt-16 flex flex-wrap items-center justify-center gap-2">
      <button className={`${btn} border-line hover:border-fg disabled:opacity-40`} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page"><ChevronLeft size={18} /></button>
      {windowed(page, totalPages).map((n, i) =>
        n === "gap" ? <span key={`g${i}`} className="px-1 text-muted" aria-hidden>…</span> : (
          <button key={n} className={`${btn} ${n === page ? "border-gold bg-fg text-bg" : "border-line hover:border-fg"}`} aria-current={n === page ? "page" : undefined} aria-label={`Page ${n}`} onClick={() => onChange(n)}>{n}</button>
        ),
      )}
      <button className={`${btn} border-line hover:border-fg disabled:opacity-40`} disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="Next page"><ChevronRight size={18} /></button>
    </nav>
  );
}
