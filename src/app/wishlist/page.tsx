"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useAppSelector } from "@/redux/store";
import { getFavorites, removeFavorite, type FavoriteProduct } from "@/services/favorite";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { formatCurrency, getImageUrl } from "@/lib/utils";
import Image from "next/image";
import { addItemToCart } from "@/redux/features/cart-slice";
import { removeItemFromWishlist } from "@/redux/features/wishlist-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

function FavoriteItemRow({
  item,
  onRemove,
}: {
  item: FavoriteProduct;
  onRemove: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const product = item.product;
  const productId = product?.id ?? item.productId;

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(
      addItemToCart({
        id: product.id,
        title: product.name,
        price: product.originalPrice,
        discountedPrice: product.salePrice ?? product.originalPrice,
        quantity: 1,
      })
    );
  };

  return (
    <div className="flex items-center border-t border-gray-3 py-5 px-10">
      <div className="min-w-[83px]">
        <button
          onClick={onRemove}
          aria-label="Xóa khỏi yêu thích"
          className="flex items-center justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-gray-2 border border-gray-3 ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
        >
          <svg
            className="fill-current"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.19509 8.22222C8.92661 7.95374 8.49131 7.95374 8.22282 8.22222C7.95433 8.49071 7.95433 8.92601 8.22282 9.1945L10.0284 11L8.22284 12.8056C7.95435 13.074 7.95435 13.5093 8.22284 13.7778C8.49133 14.0463 8.92663 14.0463 9.19511 13.7778L11.0006 11.9723L12.8061 13.7778C13.0746 14.0463 13.5099 14.0463 13.7784 13.7778C14.0469 13.5093 14.0469 13.074 13.7784 12.8055L11.9729 11L13.7784 9.19451C14.0469 8.92603 14.0469 8.49073 13.7784 8.22224C13.5099 7.95376 13.0746 7.95376 12.8062 8.22224L11.0006 10.0278L9.19509 8.22222Z"
              fill=""
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.0007 1.14587C5.55835 1.14587 1.14648 5.55773 1.14648 11C1.14648 16.4423 5.55835 20.8542 11.0007 20.8542C16.443 20.8542 20.8548 16.4423 20.8548 11C20.8548 5.55773 16.443 1.14587 11.0007 1.14587ZM2.52148 11C2.52148 6.31713 6.31774 2.52087 11.0007 2.52087C15.6836 2.52087 19.4798 6.31713 19.4798 11C19.4798 15.683 15.6836 19.4792 11.0007 19.4792C6.31774 19.4792 2.52148 15.683 2.52148 11Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      <div className="min-w-[387px]">
        <div className="flex items-center gap-5.5">
          <div className="flex items-center justify-center rounded-[5px] bg-gray-2 max-w-[80px] w-full h-17.5">
            <Image
              src={getImageUrl(product?.imageUrl) || "/images/products/default.svg"}
              alt={product?.name || ""}
              width={80}
              height={80}
            />
          </div>
          <h3 className="text-dark ease-out duration-200 hover:text-blue">
            <Link href={`/products/${productId}`}>{product?.name || `Sản phẩm #${productId}`}</Link>
          </h3>
        </div>
      </div>
      <div className="min-w-[205px]">
        <p className="text-dark">
          {formatCurrency(product?.salePrice ?? product?.originalPrice ?? 0, "VND")}
        </p>
      </div>
      <div className="min-w-[265px]">
        <span className="text-green-600">Còn hàng</span>
      </div>
      <div className="min-w-[150px] flex justify-end">
        <button
          onClick={handleAddToCart}
          className="inline-flex items-center justify-center font-bold text-sm text-white bg-blue-600 border-[3px] border-blue-700 py-2.5 px-6 rounded-md ease-out duration-200 hover:bg-blue-700 hover:border-blue-800 shadow-lg"
        >
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const { customer, isAuthenticated } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const localWishlist = useAppSelector((state) => state.wishlistReducer.items);
  const [apiFavorites, setApiFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && customer?.id) {
      getFavorites(customer.id)
        .then(setApiFavorites)
        .catch(() => setApiFavorites([]))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setApiFavorites([]);
    }
  }, [isAuthenticated, customer?.id]);

  const handleRemoveFavorite = async (productId: number) => {
    if (!customer?.id) return;
    try {
      await removeFavorite(customer.id, productId);
      setApiFavorites((prev) => prev.filter((f) => (f.product?.id ?? f.productId) !== productId));
    } catch {
      // ignore
    }
  };

  const handleRemoveLocal = (productId: number) => {
    dispatch(removeItemFromWishlist(productId));
  };

  const hasItems = isAuthenticated
    ? apiFavorites.length > 0
    : localWishlist.length > 0;

  return (
    <>
      <Breadcrumb title="Yêu thích" pages={["Yêu thích"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
            <h2 className="font-medium text-dark text-2xl">Danh sách yêu thích của bạn</h2>
          </div>

          {loading ? (
            <div className="bg-white rounded-[10px] shadow-1 p-10">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-1 rounded" />
                ))}
              </div>
            </div>
          ) : !hasItems ? (
            <div className="bg-white rounded-[10px] shadow-1 p-20 text-center">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-dark mb-2">Chưa có sản phẩm yêu thích</h3>
              <p className="text-dark-4 mb-6">
                {isAuthenticated
                  ? "Hãy thêm sản phẩm yêu thích để xem tại đây"
                  : "Đăng nhập để đồng bộ danh sách yêu thích hoặc thêm sản phẩm từ trang sản phẩm"}
              </p>
              <Link
                href="/shop-with-sidebar"
                className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
              >
                Xem sản phẩm
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-[10px] shadow-1">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[1170px]">
                  <div className="flex items-center py-5.5 px-10">
                    <div className="min-w-[83px]" />
                    <div className="min-w-[387px]">
                      <p className="text-dark">Sản phẩm</p>
                    </div>
                    <div className="min-w-[205px]">
                      <p className="text-dark">Đơn giá</p>
                    </div>
                    <div className="min-w-[265px]">
                      <p className="text-dark">Tình trạng</p>
                    </div>
                    <div className="min-w-[150px]">
                      <p className="text-dark text-right">Thao tác</p>
                    </div>
                  </div>
                  {isAuthenticated
                    ? apiFavorites.map((item) => (
                        <FavoriteItemRow
                          key={item.id ?? `${item.customerId}-${item.productId}`}
                          item={item}
                          onRemove={() => handleRemoveFavorite(item.product?.id ?? item.productId)}
                        />
                      ))
                    : localWishlist.map((item) => (
                        <div key={item.id} className="flex items-center border-t border-gray-3 py-5 px-10">
                          <div className="min-w-[83px]">
                            <button
                              onClick={() => handleRemoveLocal(item.id)}
                              aria-label="Xóa khỏi yêu thích"
                              className="flex items-center justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-gray-2 border border-gray-3 ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
                            >
                              <svg
                                className="fill-current"
                                width="22"
                                height="22"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.19509 8.22222C8.92661 7.95374 8.49131 7.95374 8.22282 8.22222C7.95433 8.49071 7.95433 8.92601 8.22282 9.1945L10.0284 11L8.22284 12.8056C7.95435 13.074 7.95435 13.5093 8.22284 13.7778C8.49133 14.0463 8.92663 14.0463 9.19511 13.7778L11.0006 11.9723L12.8061 13.7778C13.0746 14.0463 13.5099 14.0463 13.7784 13.7778C14.0469 13.5093 14.0469 13.074 13.7784 12.8055L11.9729 11L13.7784 9.19451C14.0469 8.92603 14.0469 8.49073 13.7784 8.22224C13.5099 7.95376 13.0746 7.95376 12.8062 8.22224L11.0006 10.0278L9.19509 8.22222Z" fill="" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M11.0007 1.14587C5.55835 1.14587 1.14648 5.55773 1.14648 11C1.14648 16.4423 5.55835 20.8542 11.0007 20.8542C16.443 20.8542 20.8548 16.4423 20.8548 11C20.8548 5.55773 16.443 1.14587 11.0007 1.14587ZM2.52148 11C2.52148 6.31713 6.31774 2.52087 11.0007 2.52087C15.6836 2.52087 19.4798 6.31713 19.4798 11C19.4798 15.683 15.6836 19.4792 11.0007 19.4792C6.31774 19.4792 2.52148 15.683 2.52148 11Z" fill="" />
                              </svg>
                            </button>
                          </div>
                          <div className="min-w-[387px] flex items-center gap-5.5">
                            <div className="flex items-center justify-center rounded-[5px] bg-gray-2 max-w-[80px] w-full h-17.5">
                              <Image
                                src={getImageUrl(item.imgs?.thumbnails?.[0] || item.imgs?.previews?.[0]) || "/images/products/default.svg"}
                                alt={item.title}
                                width={80}
                                height={80}
                              />
                            </div>
                            <h3 className="text-dark ease-out duration-200 hover:text-blue">
                              <Link href={`/products/${item.id}`}>{item.title}</Link>
                            </h3>
                          </div>
                          <div className="min-w-[205px]">
                            <p className="text-dark">{formatCurrency(item.discountedPrice, "VND")}</p>
                          </div>
                          <div className="min-w-[265px]">
                            <span className="text-green-600">Còn hàng</span>
                          </div>
                          <div className="min-w-[150px] flex justify-end">
                            <button
                              onClick={() =>
                                dispatch(
                                  addItemToCart({
                                    ...item,
                                    quantity: 1,
                                  })
                                )
                              }
                              className="inline-flex items-center justify-center font-bold text-sm text-white bg-blue-600 border-[3px] border-blue-700 py-2.5 px-6 rounded-md ease-out duration-200 hover:bg-blue-700 hover:border-blue-800 shadow-lg"
                            >
                              Thêm vào giỏ hàng
                            </button>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
