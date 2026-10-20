export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n);

/** Shared responsive product grid: large cards, one column on small phones. */
export const productGrid = "grid grid-cols-1 gap-x-6 gap-y-14 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:gap-x-8";
