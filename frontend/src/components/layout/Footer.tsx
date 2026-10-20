import { Link } from "react-router-dom";
import { useCatalog } from "../../context/CatalogContext";
import { container } from "../ui/Section";

const staticCols: { title: string; items: string[][] }[] = [
  { title: "Care", items: [["Shipping", "/about#shipping"], ["Returns", "/about#returns"], ["Product care", "/about#care"]] },
  { title: "House", items: [["Our story", "/about"], ["Contact", "/about#contact"], ["Wishlist", "/wishlist"], ["Cart", "/cart"]] },
];

export function Footer() {
  const { categories } = useCatalog();
  const cols = [{ title: "Shop", items: [["Shop all", "/shop"], ...categories.slice(0, 6).map((c) => [c.label, `/category/${c.slug}`])] }, ...staticCols];
  return (
    <footer className="bg-espresso text-ivory dark:bg-ink">
      <div className={`${container} grid gap-12 py-20 md:grid-cols-[1.4fr_2fr]`}>
        <div>
          <p className="font-display text-4xl tracking-[0.26em]">AURELLE</p>
          <p className="mt-4 max-w-xs text-lg text-ivory/75">Objects of lasting distinction.</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {cols.map((c) => (
            <div key={c.title}>
              <h2 className="font-sans text-base font-semibold">{c.title}</h2>
              <ul className="mt-4 space-y-1">
                {c.items.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="inline-block py-2 text-base text-ivory/75 transition-colors duration-300 hover:text-gold">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-ivory/15">
        <div className={`${container} py-7 text-sm text-ivory/65`}>© {new Date().getFullYear()} AURELLE. All rights reserved.</div>
      </div>
    </footer>
  );
}
