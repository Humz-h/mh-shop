"use client"

import { Button } from "@/components/UI/Button"
import { Smartphone, Laptop, Headphones, Watch, Gamepad2, Camera } from "@/components/UI/icons"

const categories = [
  { name: "Điện thoại", icon: Smartphone, count: 150 },
  { name: "Laptop", icon: Laptop, count: 89 },
  { name: "Phụ kiện", icon: Headphones, count: 234 },
  { name: "Đồng hồ", icon: Watch, count: 67 },
  { name: "Gaming", icon: Gamepad2, count: 45 },
  { name: "Camera", icon: Camera, count: 32 },
]

export function CategoryNav() {
  return (
    <section className="py-6 border-b">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Danh mục sản phẩm</h2>
          <Button variant="outline" size="sm" className="rounded-full">
            Xem tất cả
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.name}
                variant="ghost"
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-accent/50 rounded-xl shadow-card"
              >
                <Icon className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <div className="font-medium text-sm">{category.name}</div>
                  <div className="text-xs text-muted-foreground">{category.count} sản phẩm</div>
                </div>
              </Button>
            )
          })}
        </div>
      </div>
    </section>
  )
} 