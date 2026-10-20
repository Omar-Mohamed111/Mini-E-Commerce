import { img } from "../data/images";
import { ButtonLink } from "../components/ui/Button";
import { Reveal } from "../components/ui/Reveal";
import { SafeImage } from "../components/ui/SafeImage";
import { Section, SectionHeading, container } from "../components/ui/Section";
import type { CSSProperties } from "react";

const principles = [
  { title: "Materials first", text: "Solid metals, full-grain leather, hand-finished ceramics. If a material won’t age well, it doesn’t make the collection.", src: img.walletA },
  { title: "Makers we know", text: "We work with small workshops across many crafts, and visit them before we list anything.", src: img.perfumeB },
  { title: "Built to be kept", text: "Every piece is chosen to be repaired, refilled or refinished. Buying less, and keeping it longer, is the whole idea.", src: img.watchB },
];

const policies = [
  { id: "shipping", title: "Shipping", text: "Complimentary on orders over $500, otherwise a flat $15. Orders are packed in recycled, reusable packaging and typically arrive within five working days." },
  { id: "returns", title: "Returns", text: "Return unworn, unused pieces within 30 days for a full refund." },
  { id: "care", title: "Product care", text: "Each piece ships with a care card. Store pieces dry, away from direct sunlight, and follow the guidance on the card." },
];

export default function About() {
  return (
    <>
      <section className={`${container} grid items-center gap-14 py-20 sm:py-28 lg:grid-cols-2 lg:gap-20`}>
        <div>
          <p className="rise text-lg text-gold-text">Our story</p>
          <h1 className="rise mt-4 text-5xl leading-[1.04] sm:text-6xl xl:text-8xl" style={{ "--d": "0.1s" } as CSSProperties}>Objects of lasting distinction.</h1>
          <p className="rise mt-8 max-w-xl text-xl leading-relaxed text-muted" style={{ "--d": "0.25s" } as CSSProperties}>
            AURELLE is a curated house for the things worth owning: exceptional objects from makers we trust, gathered under one standard.
          </p>
        </div>
        <SafeImage src={img.story} alt="A hand-finished ceramic object in soft light" loading="eager" className="arch-in aspect-[4/5] w-full rounded-t-full object-cover" />
      </section>

      <Section className="bg-surface">
        <SectionHeading title="What we believe" text="Three ideas guide every decision we make about what to stock." />
        <div className="mt-16 grid gap-14 md:grid-cols-3 md:gap-10">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.12}>
              <SafeImage src={p.src} alt="" className="aspect-[4/3] w-full object-cover" />
              <h3 className="mt-6 text-3xl">{p.title}</h3>
              <p className="mt-3 text-lg leading-relaxed text-muted">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <section className="bg-ink py-24 text-ivory sm:py-32">
        <Reveal className={`${container} mx-auto max-w-4xl text-center`}>
          <p className="font-display text-3xl leading-snug sm:text-5xl">We would rather sell you one thing you keep for thirty years than ten you replace.</p>
          <ButtonLink to="/shop" variant="gold" className="mt-12">Shop the collection</ButtonLink>
        </Reveal>
      </section>

      <Section>
        <SectionHeading title="Delivery, returns and care" />
        <div className="mt-14 grid gap-12 md:grid-cols-3">
          {policies.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1}>
              <div id={p.id} className="scroll-mt-28 border-t border-gold pt-6">
                <h3 className="text-3xl">{p.title}</h3>
                <p className="mt-3 text-lg leading-relaxed text-muted">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-line" id="contact">
        <div className="max-w-2xl">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl">Contact</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">Questions about a piece, an order or a gift? Write to us and we’ll reply within two working days.</p>
          <a href="mailto:hello@aurelle.example" className="mt-8 inline-block border-b border-gold pb-1 font-display text-2xl sm:text-3xl">hello@aurelle.example</a>
        </div>
      </Section>
    </>
  );
}
