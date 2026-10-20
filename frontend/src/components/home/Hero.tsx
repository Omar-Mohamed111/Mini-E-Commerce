import { useEffect, useRef, type CSSProperties } from "react";
import { img } from "../../data/images";
import { ButtonLink } from "../ui/Button";
import { SafeImage } from "../ui/SafeImage";
import { container } from "../ui/Section";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);

  // Subtle image drift, only on fine pointers and when motion is allowed.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ok = matchMedia("(pointer: fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ok) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / innerWidth - 0.5) * 14;
        const y = (e.clientY / innerHeight - 0.5) * 10;
        el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.06)`;
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section className="overflow-hidden">
      <div className={`${container} grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:gap-20`}>
        <div className="order-2 lg:order-1">
          <h1 className="rise text-5xl leading-[1.02] min-[400px]:text-6xl md:text-7xl xl:text-[5.75rem]">Objects of lasting distinction.</h1>
          <p className="rise mt-8 max-w-lg text-lg leading-relaxed text-muted sm:text-xl" style={{ "--d": "0.25s" } as CSSProperties}>
            A curated house of exceptional objects, chosen for craft, made in small batches and meant to be kept.
          </p>
          <div className="rise mt-12 flex flex-wrap gap-4" style={{ "--d": "0.45s" } as CSSProperties}>
            <ButtonLink to="/shop">Shop the collection</ButtonLink>
            <ButtonLink to="/#categories" variant="outline">Browse categories</ButtonLink>
          </div>
        </div>
        <div className="order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-xl">
          <div className="arch-in relative aspect-[4/5] overflow-hidden rounded-t-full border border-gold/50 bg-surface p-2">
            <div className="h-full w-full overflow-hidden rounded-t-full">
              <div ref={ref} className="h-full w-full transition-transform duration-500 ease-out will-change-transform">
                <SafeImage src={img.hero} alt="A luxury timepiece, photographed in warm light" loading="eager" fetchPriority="high" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
