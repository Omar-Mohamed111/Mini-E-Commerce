import { useState, type ImgHTMLAttributes } from "react";

/** Image with a quiet placeholder if the source fails, so layouts never break. */
export function SafeImage({ className = "", alt, ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div role="img" aria-label={alt} className={`bg-surface grid place-items-center text-muted font-display text-sm ${className}`}>
        AURELLE
      </div>
    );
  }
  return <img alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} className={className} {...rest} />;
}
