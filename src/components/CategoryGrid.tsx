"use client"

import { Card, CardContent } from "@/components/UI/card"
import { Button } from "@/components/UI/Button"
import { Badge } from "@/components/UI/badge"
import { Star, Heart, ShoppingCart } from "@/components/UI/icons"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useProducts } from "@/hooks/useProducts"
import { getImageUrl, getDisplayPrice, formatCurrency } from "@/lib/utils"
import { PRODUCT_IMAGE_ASPECT_RATIO } from "@/lib/imageConfig"

export function CategoryGrid() {
  const { products, loading, error } = useProducts()
  const [favorites, setFavorites] = useState<number[]>([])
  const router = useRouter()

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const formatPrice = (price: number | null | undefined) => formatCurrency(price, "VND")

  if (loading) {
    return (
      <section className="py-12">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-balance">Sản phẩm nổi bật</h2>
              <p className="text-muted-foreground mt-2">Đang tải sản phẩm...</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className={`${PRODUCT_IMAGE_ASPECT_RATIO} w-full bg-gray-200 rounded-xl`}></div>
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12">
        <div className="container px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-balance">Sản phẩm nổi bật</h2>
            <p className="text-red-500 mt-4">Lỗi tải sản phẩm: {error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Thử lại
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-balance">Sản phẩm nổi bật</h2>
            <p className="text-muted-foreground mt-2">Khám phá những sản phẩm công nghệ hàng đầu</p>
          </div>
          <Link href="/products" className="inline-flex items-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium">Xem tất cả sản phẩm</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card 
              key={product.id} 
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden rounded-xl flex flex-col"
            >
              <CardContent className="p-0 flex flex-col h-full">
                {/* Khối 1: Hình ảnh */}
                <div className="relative p-2">
                  <div className={`${PRODUCT_IMAGE_ASPECT_RATIO} w-full bg-gray-100 rounded-lg overflow-hidden cursor-pointer relative`} onClick={() => router.push(`/products/${product.id}`)}>
                    <Image
                      src={getImageUrl(product.imageUrl)}
                      alt={product.name || product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge variant="default">Mới</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                      }`}
                    />
                  </Button>
                </div>

                {/* Khối 2: Văn bản - Thông tin sản phẩm */}
                <div className="p-4 flex-1">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Sản phẩm</p>
                    <h3 
                      className="font-semibold text-lg text-balance hover:text-primary transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/products/${product.id}`);
                      }}
                    >
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-sm text-muted-foreground mt-1 mb-3 line-clamp-2">{product.description}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium ml-1">4.5</span>
                    </div>
                    <span className="text-sm text-muted-foreground">(0 đánh giá)</span>
                  </div>

                  <div className="flex items-center space-x-2">
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
                    className="w-full group rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      // persist to localStorage cart
                      try {
                        const raw = typeof window !== "undefined" ? localStorage.getItem("cart") : null
                        const cart: { id: number; name: string; price: number; image?: string; quantity: number }[] = raw ? JSON.parse(raw) : []
                        const existing = cart.find(c => c.id === product.id)
                        if (existing) {
                          existing.quantity += 1
                        } else {
                          const displayPrice = getDisplayPrice(product.originalPrice || product.price || 0, product.salePrice);
                          cart.push({ id: product.id, name: product.name || product.title, price: displayPrice, image: product.imageUrl || undefined, quantity: 1 })
                        }
                        localStorage.setItem("cart", JSON.stringify(cart))
                      } catch {}
                      // include params for first-load fallback
                      const displayPrice = getDisplayPrice(product.originalPrice || product.price || 0, product.salePrice);
                      const params = new URLSearchParams({ id: String(product.id), name: product.name || product.title, price: String(displayPrice), image: product.imageUrl || "" })
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
      </div>
    </section>
  )
} 