import { Link, type LinkProps } from "react-router-dom";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "solid" | "outline" | "gold" | "ghost-light";
const base =
  "inline-flex min-h-14 items-center justify-center gap-2 px-9 text-base font-medium tracking-wide transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50";
const variants: Record<Variant, string> = {
  solid: "bg-fg text-bg hover:bg-gold hover:text-ink",
  outline: "border border-fg/40 text-fg hover:border-gold hover:text-gold-text",
  gold: "bg-gold text-ink hover:bg-ivory",
  "ghost-light": "border border-ivory/40 text-ivory hover:border-gold hover:text-gold",
};

interface Common { variant?: Variant; children: ReactNode; className?: string }

export function Button({ variant = "solid", className = "", children, ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...rest}>{children}</button>;
}

export function ButtonLink({ variant = "solid", className = "", children, ...rest }: Common & LinkProps) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...rest}>{children}</Link>;
}
