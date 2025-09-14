import { CategoryNav } from "../components/CategoryNavVN";
import { HeroBanner } from "../components/HeroBannerVN";
import { CategoryGrid } from "@/components/CategoryGrid";

export default function HomePage() {
  return (
    <main>
      <CategoryNav />
      <HeroBanner />
      <CategoryGrid />
    </main>
  )
}
