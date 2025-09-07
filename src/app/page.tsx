import { CategoryNav } from "@/components/CategoryNav";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoryGrid } from "@/components/CategoryGrid";

export default function HomePage() {
  return (
    <main>
      <CategoryNav />
      <HeroBanner />
      <CategoryGrid />
    </main>
  );
}
