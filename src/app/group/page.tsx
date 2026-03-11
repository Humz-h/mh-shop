"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { fetchProductsByCategory, fetchProductsByCategoryId } from "@/services/product";
import { getCategoryNameById } from "@/services/category";
import type { Product } from "@/types";
import SingleGridItem from "@/components/Shop/SingleGridItem";

function GroupContent() {
  const searchParams = useSearchParams();
  const categoryName = searchParams.get("name") || "";
  const categoryIdParam = searchParams.get("id") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryDisplayName, setCategoryDisplayName] = useState<string>("");

  const displayLabel = categoryName || categoryDisplayName || (categoryIdParam ? `Danh mục #${categoryIdParam}` : "");

  useEffect(() => {
    const loadProductsByCategory = async () => {
      const categoryId = categoryIdParam ? parseInt(categoryIdParam, 10) : NaN;
      const hasValidId = !isNaN(categoryId) && categoryId > 0;
      const hasValidName = categoryName.trim().length > 0;

      if (!hasValidId && !hasValidName) {
        setProducts([]);
        setCategoryDisplayName("");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setCategoryDisplayName("");

        if (hasValidId) {
          const [results, name] = await Promise.all([
            fetchProductsByCategoryId(categoryId),
            getCategoryNameById(categoryId),
          ]);
          setProducts(results);
          if (name) setCategoryDisplayName(name);
        } else {
          const results = await fetchProductsByCategory(categoryName);
          setProducts(results);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải sản phẩm theo danh mục");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProductsByCategory();
  }, [categoryName, categoryIdParam]);

  return (
    <section className="overflow-hidden pt-[209px] sm:pt-[155px] lg:pt-[95px] xl:pt-[165px] pb-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {displayLabel && (
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-blue-600 transition-colors duration-200">
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{displayLabel}</span>
            </nav>
          )}
          <h2 className="font-semibold text-gray-900 text-2xl sm:text-3xl mb-6">
            Danh mục sản phẩm: {displayLabel}
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="w-full h-64 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <a
                href="/shop-with-sidebar"
                className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
              >
                Xem tất cả sản phẩm
              </a>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-card">
              <div className="mb-4">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-dark mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-dark-4 mb-4">
                Không có sản phẩm nào trong danh mục &quot;{displayLabel}&quot;.
              </p>
              <Link
                href="/shop-with-sidebar"
                className="inline-flex font-semibold text-white bg-blue-600 py-3 px-7 rounded-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-md"
              >
                Xem tất cả sản phẩm
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-500 mb-6">
                Tìm thấy <span className="font-semibold text-gray-900">{products.length}</span> sản phẩm
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <SingleGridItem key={product.id} item={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
  );
}

export default function GroupPage() {
  return (
    <Suspense fallback={
      <section className="overflow-hidden pt-[209px] sm:pt-[155px] lg:pt-[95px] xl:pt-[165px] pb-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="w-full h-64 bg-gray-1 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-1 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-1 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
    }>
      <GroupContent />
    </Suspense>
  );
}

