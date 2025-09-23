import { MainBanner } from "@/components/MainBanner";
import { CategoryGrid } from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";

export default function HomePage() {
  return (
    <main>
      <MainBanner />
      <div className="container mx-auto px-4 py-8">
        <section className="space-y-8">
          <CategoryGrid />
          <FeaturedProducts />
        </section>
      </div>
    </main>
  )
}
