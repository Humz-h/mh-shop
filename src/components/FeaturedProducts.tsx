"use client";

import { useProducts } from "@/hooks/useProducts";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/Button";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCT_IMAGE_ASPECT_RATIO } from "@/lib/imageConfig";

export default function FeaturedProducts() {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Sản phẩm nổi bật</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className={`${PRODUCT_IMAGE_ASPECT_RATIO} w-full bg-gray-200 rounded-xl`}></div>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Sản phẩm nổi bật</h2>
        <div className="text-center">
          <p className="text-red-500 mb-4">Lỗi tải sản phẩm: {error}</p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </section>
    );
  }

  if (!products.length) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Sản phẩm nổi bật</h2>
          <Badge className="bg-green-100 text-green-800 border-green-200">{products.length} sản phẩm</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
