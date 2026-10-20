import type { ReactNode } from "react";
import { productGrid } from "../../lib";
import { Button, ButtonLink } from "./Button";

export function LoadingGrid({ count = 4 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading products" className={productGrid}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/5] bg-surface" />
          <div className="mt-4 h-4 w-3/4 bg-surface" />
          <div className="mt-2 h-3 w-1/3 bg-surface" />
        </div>
      ))}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-lg border-y border-line py-20 text-center">
      <h2 className="text-3xl">{title}</h2>
      <div className="mt-3 text-lg text-muted">{children}</div>
    </div>
  );
}

export function ErrorState({ onRetry, message }: { onRetry: () => void; message?: string }) {
  return (
    <div role="alert">
      <Panel title="We couldn’t load the collection">
        <p>{message ?? "Check your connection, then try again."}</p>
        <Button className="mt-6" onClick={onRetry}>Try again</Button>
      </Panel>
    </div>
  );
}

export function EmptyState({ title, text, actionLabel, to }: { title: string; text: string; actionLabel: string; to: string }) {
  return (
    <Panel title={title}>
      <p>{text}</p>
      <ButtonLink to={to} className="mt-6">{actionLabel}</ButtonLink>
    </Panel>
  );
}
