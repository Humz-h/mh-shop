"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchProductsByGroup } from "@/services/product";
import type { Product } from "@/types";
import Breadcrumb from "@/components/Common/Breadcrumb";
import SingleGridItem from "@/components/Shop/SingleGridItem";

function GroupContent() {
  const searchParams = useSearchParams();
  const groupName = searchParams.get("name") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProductsByGroup = async () => {
      if (!groupName.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const results = await fetchProductsByGroup(groupName);
        setProducts(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải sản phẩm theo nhóm");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProductsByGroup();
  }, [groupName]);

  return (
    <>
      <Breadcrumb title="Nhóm sản phẩm" pages={["Nhóm sản phẩm"]} />
      
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <h2 className="font-medium text-dark text-2xl sm:text-3xl mb-6">
            Nhóm sản phẩm: {groupName}
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
              <a
                href="/shop-with-sidebar"
                className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
              >
                Xem tất cả sản phẩm
              </a>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
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
                Không có sản phẩm nào trong nhóm &quot;{groupName}&quot;.
              </p>
              <a
                href="/shop-with-sidebar"
                className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
              >
                Xem tất cả sản phẩm
              </a>
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

export default function GroupPage() {
  return (
    <Suspense fallback={
      <>
        <Breadcrumb title="Nhóm sản phẩm" pages={["Nhóm sản phẩm"]} />
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
      <GroupContent />
    </Suspense>
  );
}

