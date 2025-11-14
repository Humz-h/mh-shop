"use client";

import { Star, Heart, ShoppingCart } from "@/components/UI/icons";
import { Button } from "@/components/UI/Button";
import { Card, CardContent } from "@/components/UI/card";
import { Badge } from "@/components/UI/badge";
import type { Product } from "@/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getImageUrl, getDisplayPrice, formatCurrency } from "@/lib/utils";
import { PRODUCT_IMAGE_ASPECT_RATIO } from "@/lib/imageConfig";

interface ProductCardProps {
  product: Product;
  discount?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export function ProductCard({ product, discount, isNew, isBestSeller }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  const formatPrice = (price: number | null | undefined) => formatCurrency(price, "VND");

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-border bg-card overflow-hidden flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Khối 1: Hình ảnh */}
        <div className="relative overflow-hidden p-2">
          <div className={`${PRODUCT_IMAGE_ASPECT_RATIO} w-full bg-gray-100 rounded-lg overflow-hidden relative`}>
            <Image
              src={getImageUrl(product.imageUrl)}
              alt={product.name || product.title || "Product"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {discount ? <Badge className="bg-destructive text-destructive-foreground">-{discount}%</Badge> : null}
            {isNew ? <Badge className="bg-secondary text-secondary-foreground">Mới</Badge> : null}
            {isBestSeller ? <Badge className="bg-primary text-primary-foreground">Bán chạy</Badge> : null}
          </div>

          {/* Wishlist button */}
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-3 right-3 h-8 w-8 p-0 bg-background/80 hover:bg-background"
            onClick={() => setIsFavorite((v) => !v)}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>

          {/* Quick view overlay */}
          <div className="absolute inset-2 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
            <Button variant="secondary" size="sm" onClick={() => router.push(`/products/${product.id}`)}>
              Xem nhanh
            </Button>
          </div>
        </div>

        {/* Khối 2: Văn bản - Thông tin sản phẩm */}
        <div className="p-4 flex-1">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Sản phẩm</p>
            <h3 
              className="font-semibold text-lg text-card-foreground line-clamp-2 mb-2 text-balance cursor-pointer hover:text-primary transition-colors"
              onClick={() => router.push(`/products/${product.id}`)}
            >
              {product.name}
            </h3>
            {product.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium ml-1">4.5</span>
            </div>
            <span className="text-sm text-muted-foreground">(0 đánh giá)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-2">
            {product.salePrice !== undefined && product.salePrice !== null && typeof product.salePrice === 'number' && !isNaN(product.salePrice) ? (
              <>
                <span className="text-xl font-bold text-primary">{formatPrice(product.salePrice)}</span>
                {(product.originalPrice || product.price) && typeof (product.originalPrice || product.price) === 'number' && !isNaN(product.originalPrice || product.price || 0) && product.salePrice < (product.originalPrice || product.price || 0) && (
                  <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice || product.price)}</span>
                )}
              </>
            ) : (
              <span className="text-xl font-bold text-primary">{formatPrice(product.originalPrice || product.price || 0)}</span>
            )}
            {product.stock !== undefined && (
              <span className="text-sm text-muted-foreground">
                Còn {product.stock} sản phẩm
              </span>
            )}
          </div>
        </div>

        {/* Khối 3: Nút thêm vào giỏ hàng */}
        <div className="p-4 pt-0">
          <Button
            className="w-full"
            size="sm"
            onClick={() => {
              try {
                const raw = typeof window !== "undefined" ? localStorage.getItem("cart") : null
                const cart: { id: number; name: string; price: number; image?: string; quantity: number }[] = raw ? JSON.parse(raw) : []
                const existing = cart.find(c => c.id === product.id)
                if (existing) {
                  existing.quantity += 1
                } else {
                  const displayPrice = getDisplayPrice(product.originalPrice || product.price || 0, product.salePrice);
                  cart.push({ id: product.id, name: product.name || product.title || "Product", price: displayPrice, image: product.imageUrl || undefined, quantity: 1 })
                }
                localStorage.setItem("cart", JSON.stringify(cart))
              } catch {}
              router.push("/cart")
            }}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Thêm vào giỏ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
