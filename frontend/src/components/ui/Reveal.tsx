import { useEffect, useRef, useState, type ReactNode } from "react";

/** Fades and lifts its children into view once, when scrolled into the viewport. */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return setSeen(true);
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSeen(true); io.disconnect(); } },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${seen ? "is-visible" : ""} ${className}`} style={{ transitionDelay: seen ? `${delay}s` : "0s" }}>
      {children}
    </div>
  );
}
