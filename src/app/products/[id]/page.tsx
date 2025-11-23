"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchProductById } from "@/services/product";
import type { Product } from "@/types";
import { getImageUrl, formatCurrency } from "@/lib/utils";
import Image from "next/image";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const productId = Number(params.id);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (productId && !isNaN(productId)) {
      loadProduct();
    } else {
      setError("ID sản phẩm không hợp lệ");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProductById(productId);
      setProduct(data);
      setSelectedVariant(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải thông tin sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const variant = product.productVariants?.find(v => v.id === selectedVariant);
    const priceToUse = variant?.price 
      ? variant.price 
      : (product.salePrice !== undefined && product.salePrice !== null 
          ? product.salePrice 
          : (product.originalPrice || product.price || 0));
    
    dispatch(
      addItemToCart({
        ...product,
        price: priceToUse,
        quantity: quantity,
      })
    );
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    dispatch(
      addItemToWishlist({
        ...product,
        status: "available",
        quantity: 1,
      })
    );
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <>
        <Breadcrumb title="Chi tiết sản phẩm" pages={["chi tiết sản phẩm"]} />
        <section className="overflow-hidden py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="animate-pulse">
              <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-17.5">
                <div className="lg:max-w-[570px] w-full">
                  <div className="lg:min-h-[512px] rounded-lg shadow-1 bg-gray-1"></div>
                </div>
                <div className="max-w-[539px] w-full space-y-4">
                  <div className="h-8 bg-gray-1 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-1 rounded w-1/2"></div>
                  <div className="h-24 bg-gray-1 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Breadcrumb title="Chi tiết sản phẩm" pages={["chi tiết sản phẩm"]} />
        <section className="overflow-hidden py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="text-center py-20">
              <p className="text-red-500 mb-4 text-lg">{error || "Không tìm thấy sản phẩm"}</p>
              <button
                onClick={() => router.push("/shop-with-sidebar")}
                className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  const productDisplayPrice = product.salePrice !== undefined && product.salePrice !== null 
    ? product.salePrice 
    : (product.originalPrice || product.price || 0);
  
  const originalPrice = product.originalPrice || product.price || 0;
  
  const selectedVariantData = selectedVariant 
    ? product.productVariants?.find(v => v.id === selectedVariant)
    : null;
  
  const displayPrice = selectedVariantData && selectedVariantData.price && selectedVariantData.price > 0
    ? selectedVariantData.price
    : productDisplayPrice;
  
  const hasDiscount = product.salePrice && product.salePrice < originalPrice && originalPrice > 0;
  const images = product.imgs?.previews || product.imgs?.thumbnails || [];
  const allImages = images.length > 0 ? images : (product.imageUrl ? [product.imageUrl] : []);
  const mainImage = allImages[selectedImageIndex] || product.imageUrl;

  return (
    <>
      <Breadcrumb title={product.name || product.title || "Chi tiết sản phẩm"} pages={["chi tiết sản phẩm"]} />
      
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-17.5">
            {/* Product Image Gallery */}
            <div className="lg:max-w-[570px] w-full">
              <div className="lg:min-h-[512px] rounded-lg shadow-1 bg-gray-2 p-4 sm:p-7.5 relative flex items-center justify-center">
                {mainImage ? (
                  <>
                    <Image
                      src={getImageUrl(mainImage)}
                      alt={product.name || product.title || "Product image"}
                      width={500}
                      height={500}
                      className="object-contain"
                      priority
                      unoptimized={getImageUrl(mainImage).startsWith('http://localhost')}
                    />
                    {typeof product.discountPercent === 'number' && product.discountPercent > 0 && (
                      <div className="absolute top-4 lg:top-6 right-4 lg:right-6 inline-flex font-medium text-custom-sm text-white bg-blue rounded py-0.5 px-2.5">
                        -{product.discountPercent}%
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-dark-4">
                    Không có ảnh
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="flex flex-wrap sm:flex-nowrap gap-4.5 mt-6">
                  {allImages.map((img, index) => {
                    const thumbnailUrl = getImageUrl(img);
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex items-center justify-center w-15 sm:w-25 h-15 sm:h-25 overflow-hidden rounded-lg bg-gray-2 shadow-1 ease-out duration-200 border-2 hover:border-blue ${
                          selectedImageIndex === index
                            ? "border-blue"
                            : "border-transparent"
                        }`}
                      >
                        <Image
                          width={100}
                          height={100}
                          src={thumbnailUrl}
                          alt={`Thumbnail ${index + 1}`}
                          className="object-cover w-full h-full"
                          unoptimized={thumbnailUrl.startsWith('http://localhost')}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="max-w-[539px] w-full">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-xl sm:text-2xl xl:text-custom-3 text-dark">
                  {product.name || product.title}
                </h2>

                {typeof product.discountPercent === 'number' && product.discountPercent > 0 && (
                  <div className="inline-flex font-medium text-custom-sm text-white bg-blue rounded py-0.5 px-2.5">
                    -{product.discountPercent}%
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-5.5 mb-4.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Image
                        key={i}
                        src="/images/icons/icon-star.svg"
                        alt="star"
                        width={18}
                        height={18}
                      />
                    ))}
                  </div>
                  <span className="text-custom-sm text-dark-4">({product.reviews || 0} đánh giá)</span>
                </div>

                {typeof product.stock === 'number' && (
                  <div className="flex items-center gap-1.5">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_375_9221)">
                        <path
                          d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.78125 19.4688 10 19.4688C15.2188 19.4688 19.4688 15.2188 19.4688 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.59375 18.0625 10.0312C18.0625 14.4375 14.4375 18.0625 10 18.0625Z"
                          fill={product.stock > 0 ? "#22AD5C" : "#EF4444"}
                        />
                        <path
                          d="M12.6875 7.09374L8.9688 10.7187L7.2813 9.06249C7.00005 8.78124 6.56255 8.81249 6.2813 9.06249C6.00005 9.34374 6.0313 9.78124 6.2813 10.0625L8.2813 12C8.4688 12.1875 8.7188 12.2812 8.9688 12.2812C9.2188 12.2812 9.4688 12.1875 9.6563 12L13.6875 8.12499C13.9688 7.84374 13.9688 7.40624 13.6875 7.12499C13.4063 6.84374 12.9688 6.84374 12.6875 7.09374Z"
                          fill={product.stock > 0 ? "#22AD5C" : "#EF4444"}
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_375_9221">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    <span className={`font-medium ${product.stock > 0 ? "text-green" : "text-red-600"}`}>
                      {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                    </span>
                  </div>
                )}
              </div>

              <h3 className="font-medium text-custom-1 mb-4.5">
                <span className="text-sm sm:text-base text-dark">
                  {formatCurrency(displayPrice, "VND")}
                </span>
                {hasDiscount && (
                  <span className="line-through text-dark-4 ml-2">
                    {formatCurrency(originalPrice, "VND")}
                  </span>
                )}
              </h3>

              {product.productCode && (
                <p className="text-custom-sm text-dark-4 mb-4.5">
                  Mã sản phẩm: {product.productCode}
                </p>
              )}

              {product.description && (
                <p className="text-dark mb-6">{product.description}</p>
              )}

              {/* Variants */}
              {product.productVariants && product.productVariants.length > 0 && (
                <div className="flex flex-col gap-4.5 border-y border-gray-3 mt-7.5 mb-9 py-9">
                  <div className="flex items-center gap-4">
                    <div className="min-w-[65px]">
                      <h4 className="font-medium text-dark">Tùy chọn:</h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      {product.productVariants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant.id)}
                          className={`px-4 py-2 rounded-md border-2 ease-out duration-200 font-medium text-sm ${
                            selectedVariant === variant.id
                              ? "border-blue bg-blue text-white"
                              : "border-gray-3 text-dark hover:border-blue"
                          }`}
                        >
                          {variant.variantName && `${variant.variantName}: `}
                          {variant.attributes}
                          {variant.price && variant.price > 0 && variant.price !== productDisplayPrice && (
                            <span className="ml-2 text-xs">
                              ({formatCurrency(variant.price, "VND")})
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity and Actions */}
              <div className="flex flex-wrap items-center gap-4.5">
                <div className="flex items-center rounded-md border border-gray-3">
                  <button
                    aria-label="button for remove product"
                    className="flex items-center justify-center w-12 h-12 ease-out duration-200 hover:text-blue"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  >
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.33301 10.0001C3.33301 9.53984 3.7061 9.16675 4.16634 9.16675H15.833C16.2932 9.16675 16.6663 9.53984 16.6663 10.0001C16.6663 10.4603 16.2932 10.8334 15.833 10.8334H4.16634C3.7061 10.8334 3.33301 10.4603 3.33301 10.0001Z"
                        fill=""
                      />
                    </svg>
                  </button>

                  <span className="flex items-center justify-center w-16 h-12 border-x border-gray-4 text-dark">
                    {quantity}
                  </span>

                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="button for add product"
                    className="flex items-center justify-center w-12 h-12 ease-out duration-200 hover:text-blue"
                  >
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.33301 10C3.33301 9.5398 3.7061 9.16671 4.16634 9.16671H15.833C16.2932 9.16671 16.6663 9.5398 16.6663 10C16.6663 10.4603 16.2932 10.8334 15.833 10.8334H4.16634C3.7061 10.8334 3.33301 10.4603 3.33301 10Z"
                        fill=""
                      />
                      <path
                        d="M9.99967 16.6667C9.53944 16.6667 9.16634 16.2936 9.16634 15.8334L9.16634 4.16671C9.16634 3.70647 9.53944 3.33337 9.99967 3.33337C10.4599 3.33337 10.833 3.70647 10.833 4.16671L10.833 15.8334C10.833 16.2936 10.4599 16.6667 9.99967 16.6667Z"
                        fill=""
                      />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="inline-flex font-medium text-dark bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Thêm vào giỏ hàng
                </button>

                <button
                  onClick={handleAddToWishlist}
                  className="flex items-center justify-center w-12 h-12 rounded-md border border-gray-3 ease-out duration-200 hover:text-white hover:bg-dark hover:border-transparent"
                >
                  <svg
                    className={`fill-current ${isFavorite ? "text-red-500" : ""}`}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.62436 4.42423C3.96537 5.18256 2.75 6.98626 2.75 9.13713C2.75 11.3345 3.64922 13.0283 4.93829 14.4798C6.00072 15.6761 7.28684 16.6677 8.54113 17.6346C8.83904 17.8643 9.13515 18.0926 9.42605 18.3219C9.95208 18.7366 10.4213 19.1006 10.8736 19.3649C11.3261 19.6293 11.6904 19.75 12 19.75C12.3096 19.75 12.6739 19.6293 13.1264 19.3649C13.5787 19.1006 14.0479 18.7366 14.574 18.3219C14.8649 18.0926 15.161 17.8643 15.4589 17.6346C16.7132 16.6677 17.9993 15.6761 19.0617 14.4798C20.3508 13.0283 21.25 11.3345 21.25 9.13713C21.25 6.98626 20.0346 5.18256 18.3756 4.42423C16.7639 3.68751 14.5983 3.88261 12.5404 6.02077C12.399 6.16766 12.2039 6.25067 12 6.25067C11.7961 6.25067 11.601 6.16766 11.4596 6.02077C9.40166 3.88261 7.23607 3.68751 5.62436 4.42423Z"
                      fill={isFavorite ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details */}
      {product.productDetails && product.productDetails.length > 0 && (
        <section className="overflow-hidden bg-gray-2 py-20">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="rounded-xl bg-white shadow-1 p-4 sm:p-6">
              <h2 className="font-medium text-2xl text-dark mb-7">Thông tin chi tiết</h2>
              <div className="space-y-0">
                {product.productDetails.flatMap((detail, detailIndex) => {
                  const fields = [];
                  if (detail.brand) {
                    fields.push({ label: "Thương hiệu", value: detail.brand });
                  }
                  if (detail.origin) {
                    fields.push({ label: "Xuất xứ", value: detail.origin });
                  }
                  if (detail.warranty) {
                    fields.push({ label: "Bảo hành", value: `${detail.warranty} tháng` });
                  }
                  if (detail.specifications) {
                    fields.push({ label: "Thông số kỹ thuật", value: detail.specifications });
                  }
                  if (detail.features) {
                    fields.push({ label: "Tính năng", value: detail.features });
                  }
                  if (detail.additionalInfo) {
                    fields.push({ label: "Thông tin bổ sung", value: detail.additionalInfo });
                  }
                  return fields.map((field, fieldIndex) => (
                    <div key={`${detailIndex}-${fieldIndex}`} className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5">
                      <div className="max-w-[450px] min-w-[140px] w-full">
                        <p className="text-sm sm:text-base text-dark font-medium">{field.label}:</p>
                      </div>
                      <div className="w-full">
                        <p className="text-sm sm:text-base text-dark">{field.value}</p>
                      </div>
                    </div>
                  ));
                })}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
