"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchProductById } from "@/services/product";
import type { Product } from "@/types";
import { Button } from "@/components/UI/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Badge } from "@/components/UI/badge";
import { Star, ShoppingCart, Heart, ArrowLeft } from "@/components/UI/icons";
import { getImageUrl, formatCurrency } from "@/lib/utils";
import { PRODUCT_DETAIL_IMAGE_ASPECT_RATIO } from "@/lib/imageConfig";
import Image from "next/image";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);

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
      // Không tự động chọn variant - để user tự chọn
      setSelectedVariant(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải thông tin sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number | null | undefined) => formatCurrency(price, "VND");

  const handleAddToCart = () => {
    if (!product) return;
    
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("cart") : null;
      type CartItem = { id: number; name: string; price: number; image?: string; quantity: number; variantId?: number };
      const cart: CartItem[] = raw ? JSON.parse(raw) : [];
      
      // Lấy giá từ variant nếu có, nếu không thì lấy từ product
      const variant = product.productVariants?.find(v => v.id === selectedVariant);
      const priceToUse = variant?.price 
        ? variant.price 
        : (product.salePrice !== undefined && product.salePrice !== null 
            ? product.salePrice 
            : (product.originalPrice || product.price || 0));
      
      const existing = cart.find(c => c.id === product.id && (!selectedVariant || c.variantId === selectedVariant));
      if (existing) {
        existing.quantity += 1;
      } else {
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: priceToUse,
          image: product.imageUrl || undefined,
          quantity: 1,
        };
        if (selectedVariant) {
          newItem.variantId = selectedVariant;
        }
        cart.push(newItem);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      router.push("/cart");
    } catch {}
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-96 rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="container mx-auto px-4 py-10">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div className="text-center py-20">
          <p className="text-red-500 mb-4 text-lg">{error || "Không tìm thấy sản phẩm"}</p>
          <Button onClick={() => router.push("/products")}>Xem tất cả sản phẩm</Button>
        </div>
      </main>
    );
  }

  // Lấy giá từ product: ưu tiên salePrice, nếu không có thì dùng originalPrice
  const productDisplayPrice = product.salePrice !== undefined && product.salePrice !== null 
    ? product.salePrice 
    : (product.originalPrice || product.price || 0);
  
  const originalPrice = product.originalPrice || product.price || 0;
  
  // Chỉ dùng giá variant nếu user đã chọn variant và variant có giá hợp lệ
  const selectedVariantData = selectedVariant 
    ? product.productVariants?.find(v => v.id === selectedVariant)
    : null;
  
  // Chỉ dùng giá variant nếu nó hợp lệ (lớn hơn 0), nếu không thì dùng giá product
  const displayPrice = selectedVariantData && selectedVariantData.price && selectedVariantData.price > 0
    ? selectedVariantData.price
    : productDisplayPrice;
  
  const hasDiscount = product.salePrice && product.salePrice < originalPrice && originalPrice > 0;

  return (
    <main className="container mx-auto px-4 py-10">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Product Image */}
        <div className="relative flex items-center justify-center">
          <div className="w-full max-w-md p-4">
            <div className={`${PRODUCT_DETAIL_IMAGE_ASPECT_RATIO} rounded-xl overflow-hidden bg-gray-100 relative`}>
              <Image
                src={getImageUrl(product.imageUrl)}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.discountPercent && product.discountPercent > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                  -{product.discountPercent}%
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            {product.productGroup && (
              <Badge variant="secondary" className="mb-2">
                {product.productGroup}
              </Badge>
            )}
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {product.productCode && (
              <p className="text-sm text-muted-foreground mb-4">
                Mã sản phẩm: {product.productCode}
              </p>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">(0 đánh giá)</span>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(displayPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            {product.discountPercent && product.discountPercent > 0 && (
              <p className="text-sm text-green-600">
                Tiết kiệm {formatPrice(originalPrice - (product.salePrice || originalPrice))}
              </p>
            )}
          </div>

          {/* Stock */}
          {product.stock !== undefined && (
            <div>
              {product.stock > 0 ? (
                <p className="text-green-600 font-medium">
                  Còn {product.stock} sản phẩm
                </p>
              ) : (
                <p className="text-red-600 font-medium">Hết hàng</p>
              )}
            </div>
          )}

          {/* Variants */}
          {product.productVariants && product.productVariants.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Tùy chọn:</h3>
              <div className="flex flex-wrap gap-2">
                {product.productVariants.map((variant) => (
                  <Button
                    key={variant.id}
                    variant={selectedVariant === variant.id ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setSelectedVariant(variant.id)}
                  >
                    {variant.variantName && `${variant.variantName}: `}
                    {variant.attributes}
                    {variant.price && variant.price > 0 && variant.price !== productDisplayPrice && (
                      <span className="ml-2 text-xs">
                        ({formatPrice(variant.price)})
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-semibold mb-2">Mô tả sản phẩm:</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              className="flex-1"
              size="lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Thêm vào giỏ hàng
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details */}
      {product.productDetails && product.productDetails.length > 0 && (
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold">Thông tin chi tiết</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.productDetails.map((detail, index) => (
              <Card key={detail.id || index}>
                <CardHeader>
                  <CardTitle>Thông tin sản phẩm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {detail.brand && (
                    <div>
                      <span className="font-semibold">Thương hiệu: </span>
                      <span>{detail.brand}</span>
                    </div>
                  )}
                  {detail.origin && (
                    <div>
                      <span className="font-semibold">Xuất xứ: </span>
                      <span>{detail.origin}</span>
                    </div>
                  )}
                  {detail.warranty && (
                    <div>
                      <span className="font-semibold">Bảo hành: </span>
                      <span>{detail.warranty} tháng</span>
                    </div>
                  )}
                  {detail.specifications && (
                    <div>
                      <span className="font-semibold">Thông số kỹ thuật: </span>
                      <p className="text-muted-foreground mt-1">{detail.specifications}</p>
                    </div>
                  )}
                  {detail.features && (
                    <div>
                      <span className="font-semibold">Tính năng: </span>
                      <p className="text-muted-foreground mt-1">{detail.features}</p>
                    </div>
                  )}
                  {detail.additionalInfo && (
                    <div>
                      <span className="font-semibold">Thông tin bổ sung: </span>
                      <p className="text-muted-foreground mt-1">{detail.additionalInfo}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

