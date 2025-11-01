"use client";

import { Star, Heart, ShoppingCart } from "@/components/UI/icons";
import { Button } from "@/components/UI/Button";
import { Card, CardContent } from "@/components/UI/card";
import { Badge } from "@/components/UI/badge";
import type { Product } from "@/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getImageUrl, getDisplayPrice, formatCurrency } from "@/lib/utils";

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
    <Card className="group hover:shadow-lg transition-all duration-300 border border-border bg-card overflow-hidden">
      <CardContent className="p-0">
        {/* Product image */}
        <div className="relative overflow-hidden">
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount ? <Badge className="bg-destructive text-destructive-foreground">-{discount}%</Badge> : null}
            {isNew ? <Badge className="bg-secondary text-secondary-foreground">Mới</Badge> : null}
            {isBestSeller ? <Badge className="bg-primary text-primary-foreground">Bán chạy</Badge> : null}
          </div>

          {/* Wishlist button */}
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/80 hover:bg-background"
            onClick={() => setIsFavorite((v) => !v)}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>

          {/* Quick view overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button variant="secondary" size="sm" onClick={() => router.push(`/products`)}>
              Xem nhanh
            </Button>
          </div>
        </div>

        {/* Product info */}
        <div className="p-4">
          <h3 className="font-medium text-card-foreground line-clamp-2 mb-2 text-balance">{product.name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-3 w-3 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">(0)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            {product.salePrice !== undefined && product.salePrice !== null && typeof product.salePrice === 'number' && !isNaN(product.salePrice) ? (
              <>
                <span className="font-bold text-lg text-primary">{formatPrice(product.salePrice)}</span>
                {product.price && typeof product.price === 'number' && !isNaN(product.price) && product.salePrice < product.price && (
                  <span className="text-sm text-muted-foreground line-through">{formatPrice(product.price)}</span>
                )}
              </>
            ) : (
              <span className="font-bold text-lg text-primary">{formatPrice(product.price)}</span>
            )}
          </div>

          {/* Add to cart button */}
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
                  const displayPrice = getDisplayPrice(product.price, product.salePrice);
                  cart.push({ id: product.id, name: product.name, price: displayPrice, image: product.imageUrl || undefined, quantity: 1 })
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
