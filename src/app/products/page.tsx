"use client";

import { useProducts } from "@/hooks/useProducts";
import { Card, CardContent } from "@/components/UI/card";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/Button";
import { Star, Heart, ShoppingCart } from "@/components/UI/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const { products, loading, error } = useProducts();
  const [favorites, setFavorites] = useState<number[]>([]);
  const router = useRouter();

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Tất cả sản phẩm</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-xl"></div>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Tất cả sản phẩm</h1>
        <div className="text-center">
          <p className="text-red-500 mb-4">Lỗi tải sản phẩm: {error}</p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Tất cả sản phẩm</h1>
      <p className="text-gray-600 mb-8">Hiển thị {products.length} sản phẩm</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden rounded-xl">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="default">Mới</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full"
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                    }`}
                  />
                </Button>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Sản phẩm</p>
                  <h3 className="font-semibold text-lg text-balance">{product.name}</h3>
                  {product.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium ml-1">4.5</span>
                  </div>
                  <span className="text-sm text-muted-foreground">(0 đánh giá)</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-primary">{formatPrice(product.price)}</span>
                  {product.stock !== undefined && (
                    <span className="text-sm text-muted-foreground">
                      Còn {product.stock} sản phẩm
                    </span>
                  )}
                </div>

                <Button
                  className="w-full group rounded-lg"
                  onClick={() => {
                    // persist to localStorage cart
                    try {
                      const raw = typeof window !== "undefined" ? localStorage.getItem("cart") : null
                      const cart: { id: number; name: string; price: number; image?: string; quantity: number }[] = raw ? JSON.parse(raw) : []
                      const existing = cart.find(c => c.id === product.id)
                      if (existing) {
                        existing.quantity += 1
                      } else {
                        cart.push({ id: product.id, name: product.name, price: product.price, image: product.imageUrl || undefined, quantity: 1 })
                      }
                      localStorage.setItem("cart", JSON.stringify(cart))
                    } catch {}
                    // include params for first-load fallback
                    const params = new URLSearchParams({ id: String(product.id), name: product.name, price: String(product.price), image: product.imageUrl || "" })
                    router.push(`/cart?${params.toString()}`)
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Thêm vào giỏ
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
} 