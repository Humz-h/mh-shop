"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { searchProducts } from "@/services/product";
import type { Product } from "@/types";
import Link from "next/link";
import Breadcrumb from "@/components/Common/Breadcrumb";
import SingleGridItem from "@/components/Shop/SingleGridItem";

function SearchContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSearchResults = async () => {
      if (!keyword.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const results = await searchProducts(keyword);
        setProducts(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tìm kiếm sản phẩm");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadSearchResults();
  }, [keyword]);

  return (
    <>
      <Breadcrumb title="Tìm kiếm" pages={["Tìm kiếm"]} />
      
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <h2 className="font-medium text-dark text-2xl sm:text-3xl mb-6">
            Kết quả tìm kiếm cho: &quot;{keyword}&quot;
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="w-full h-64 bg-gray-1 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-1 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-1 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <Link
                href="/shop-with-sidebar"
                className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
              >
                Xem tất cả sản phẩm
              </Link>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-6">
                <svg
                  className="mx-auto"
                  width="100"
                  height="100"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="50" cy="50" r="50" fill="#F3F4F6" />
                  <path
                    d="M50 30C38.9543 30 30 38.9543 30 50C30 61.0457 38.9543 70 50 70C61.0457 70 70 61.0457 70 50C70 38.9543 61.0457 30 50 30ZM50 65C41.7157 65 35 58.2843 35 50C35 41.7157 41.7157 35 50 35C58.2843 35 65 41.7157 65 50C65 58.2843 58.2843 65 50 65Z"
                    fill="#8D93A5"
                  />
                  <path
                    d="M50 45C48.3431 45 47 46.3431 47 48V52C47 53.6569 48.3431 55 50 55C51.6569 55 53 53.6569 53 52V48C53 46.3431 51.6569 45 50 45Z"
                    fill="#8D93A5"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-dark mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-dark-4 mb-6">
                Không có sản phẩm nào khớp với từ khóa &quot;{keyword}&quot;
              </p>
              <Link
                href="/shop-with-sidebar"
                className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
              >
                Xem tất cả sản phẩm
              </Link>
            </div>
          ) : (
            <>
              <p className="text-dark-4 mb-6">
                Tìm thấy <span className="font-semibold text-dark">{products.length}</span> sản phẩm
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
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <>
        <Breadcrumb title="Tìm kiếm" pages={["Tìm kiếm"]} />
        <section className="overflow-hidden py-20 bg-gray-2">
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
      </>
    }>
      <SearchContent />
    </Suspense>
  );
}

