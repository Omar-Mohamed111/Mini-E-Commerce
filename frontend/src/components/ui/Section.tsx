import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export const container = "mx-auto w-full max-w-[88rem] px-5 sm:px-8 lg:px-14";

export function Section({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`scroll-mt-24 py-24 sm:py-32 ${className}`}>
      <Reveal className={container}>{children}</Reveal>
    </section>
  );
}

export function SectionHeading({ title, text }: { title: string; text?: string }) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">{title}</h2>
      {text && <p className="mt-5 text-lg leading-relaxed text-muted">{text}</p>}
    </div>
  );
}
