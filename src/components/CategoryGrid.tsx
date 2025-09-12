"use client"

import { Card, CardContent } from "@/components/UI/card"
import { Button } from "@/components/UI/Button"
import { Badge } from "@/components/UI/badge"
import { Star, Heart, ShoppingCart } from "@/components/UI/icons"
import { useState } from "react"

const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 29990000,
    originalPrice: 32990000,
    rating: 4.8,
    reviews: 124,
    image: "/iphone-15-pro-max.png",
    badge: "Bán chạy",
    category: "Điện thoại",
  },
  {
    id: 2,
    name: "MacBook Air M3",
    price: 27990000,
    originalPrice: 31990000,
    rating: 4.9,
    reviews: 89,
    image: "/macbook-air-m3.png",
    badge: "Mới",
    category: "Laptop",
  },
  {
    id: 3,
    name: "AirPods Pro 2",
    price: 5990000,
    originalPrice: 6990000,
    rating: 4.7,
    reviews: 256,
    image: "/airpods-pro-2.jpg",
    badge: "Giảm giá",
    category: "Phụ kiện",
  },
  {
    id: 4,
    name: "Apple Watch Series 9",
    price: 8990000,
    originalPrice: 9990000,
    rating: 4.6,
    reviews: 178,
    image: "/apple-watch-series-9.jpg",
    badge: "Hot",
    category: "Đồng hồ",
  },
  {
    id: 5,
    name: "Samsung Galaxy S24 Ultra",
    price: 26990000,
    originalPrice: 29990000,
    rating: 4.8,
    reviews: 203,
    image: "/samsung-galaxy-s24-ultra.png",
    badge: "Bán chạy",
    category: "Điện thoại",
  },
  {
    id: 6,
    name: "Dell XPS 13",
    price: 23990000,
    originalPrice: 26990000,
    rating: 4.5,
    reviews: 67,
    image: "/dell-xps-13-laptop.jpg",
    badge: "Mới",
    category: "Laptop",
  },
]

export function CategoryGrid() {
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  return (
    <section className="py-12">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-balance">Sản phẩm nổi bật</h2>
            <p className="text-muted-foreground mt-2">Khám phá những sản phẩm công nghệ hàng đầu</p>
          </div>
          <Button variant="outline">Xem tất cả sản phẩm</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden rounded-xl">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant={product.badge === "Giảm giá" ? "destructive" : "default"}>{product.badge}</Badge>
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
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <h3 className="font-semibold text-lg text-balance">{product.name}</h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium ml-1">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews} đánh giá)</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-primary">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  <Button className="w-full group rounded-lg">
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