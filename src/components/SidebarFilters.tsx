"use client"

import { useState } from "react"
import { Button } from "@/components/UI/Button"
import { Card, CardContent } from "@/components/UI/card"
import { Star } from "@/components/UI/icons"
import { CardHeader, CardTitle } from "@/components/UI/card"

export function SidebarFilters() {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000])

  const categories = [
    { id: "electronics", label: "Điện tử", count: 1234 },
    { id: "fashion", label: "Thời trang", count: 856 },
    { id: "home", label: "Nhà cửa", count: 642 },
    { id: "books", label: "Sách", count: 423 },
    { id: "sports", label: "Thể thao", count: 312 },
  ]

  const brands = [
    { id: "samsung", label: "Samsung", count: 234 },
    { id: "apple", label: "Apple", count: 189 },
    { id: "nike", label: "Nike", count: 156 },
    { id: "adidas", label: "Adidas", count: 134 },
    { id: "sony", label: "Sony", count: 98 },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const handleMinChange = (val: number) => {
    setPriceRange(([, max]) => [Math.min(val, max - 100000), max])
  }
  const handleMaxChange = (val: number) => {
    setPriceRange(([min]) => [min, Math.max(val, min + 100000)])
  }

  return (
    <div className="w-64 space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Danh mục</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="h-4 w-4 rounded border-input" />
              <span className="text-sm font-medium flex-1">{category.label}</span>
              <span className="text-xs text-muted-foreground">({category.count})</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Khoảng giá</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-16">Tối thiểu</span>
              <input
                type="range"
                min={0}
                max={10000000}
                step={100000}
                value={priceRange[0]}
                onChange={(e) => handleMinChange(Number(e.target.value))}
                className="flex-1 accent-primary"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-16">Tối đa</span>
              <input
                type="range"
                min={0}
                max={10000000}
                step={100000}
                value={priceRange[1]}
                onChange={(e) => handleMaxChange(Number(e.target.value))}
                className="flex-1 accent-primary"
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </CardContent>
      </Card>

      {/* Brands */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thương hiệu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {brands.map((brand) => (
            <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="h-4 w-4 rounded border-input" />
              <span className="text-sm font-medium flex-1">{brand.label}</span>
              <span className="text-xs text-muted-foreground">({brand.count})</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Đánh giá</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="h-4 w-4 rounded border-input" />
              <span className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                ))}
                <span className="text-sm ml-1">trở lên</span>
              </span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Clear filters */}
      <Button variant="outline" className="w-full bg-transparent">
        Xóa bộ lọc
      </Button>
    </div>
  )
}
