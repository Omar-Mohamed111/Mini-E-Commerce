import { useProductList } from "../hooks/useProducts";
import { Hero } from "../components/home/Hero";
import { CategoryTiles } from "../components/home/CategoryTiles";
import { Featured } from "../components/home/Featured";
import { BrandStory } from "../components/home/BrandStory";
import { Spotlight } from "../components/home/Spotlight";
import { Newsletter } from "../components/home/Newsletter";

export default function Home() {
  // The API has no "featured" flag, so the selection is the highest-priced pieces.
  const selection = useProductList({ page: 1, limit: 5, sort: "-price" });
  return (
    <>
      <Hero />
      <CategoryTiles />
      <Featured state={selection} />
      <BrandStory />
      <Spotlight product={selection.data?.products[0]} />
      <Newsletter />
    </>
  );
}
