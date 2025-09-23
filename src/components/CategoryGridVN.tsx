"use client"

import Link from "next/link"
import { useState } from "react"

interface CategoryGridProps {
  inlinePanel?: boolean
}

const ITEMS = [
  { key: "tu-lanh", label: "Tủ lạnh", href: "/products?cat=tu-lanh", icon: "❄️" },
  { key: "may-giat", label: "Máy giặt", href: "/products?cat=may-giat", icon: "🧺" },
  { key: "dieu-hoa", label: "Điều hòa", href: "/products?cat=dieu-hoa", icon: "🌡️" },
  { key: "quat-mat", label: "Quạt mát", href: "/products?cat=quat-mat", icon: "🌀" },
  { key: "may-massage", label: "Máy massage", href: "/products?cat=may-massage", icon: "💆" },
  { key: "tivi", label: "Tivi", href: "/products?cat=tivi", icon: "📺" },
  { key: "gia-dung", label: "Đồ gia dụng", href: "/products?cat=do-gia-dung", icon: "🏠" },
  { key: "phu-kien", label: "Phụ kiện", href: "/products?cat=phu-kien", icon: "🔌" },
  { key: "pc", label: "PC,  Màn hình,  Máy in", href: "/products?cat=pc", icon: "💻" },
  { key: "thu-cu", label: "Thu cũ đổi mới", href: "/products?cat=thu-cu-doi-moi", icon: "♻️" },
  { key: "hang-cu", label: "Hàng cũ", href: "/products?cat=hang-cu", icon: "📦" },
  { key: "khuyen-mai", label: "Khuyến mãi", href: "/products?cat=khuyen-mai", icon: "🎉" },
  { key: "tin-cong-nghe", label: "Tin công nghệ", href: "/products?cat=tin-cong-nghe", icon: "📱" },
] as const

const SUB_MENUS: Record<string, { title: string; items: { label: string; href: string }[] }[]> = {
  "tu-lanh": [
    {
      title: "Dung tích",
      items: [
        { label: "Dưới 200 lít", href: "/products?cat=tu-lanh&capacity=lt200" },
        { label: "200 - 300 lít", href: "/products?cat=tu-lanh&capacity=200-300" },
        { label: "Trên 300 lít", href: "/products?cat=tu-lanh&capacity=gt300" },
      ],
    },
    {
      title: "Kiểu tủ",
      items: [
        { label: "2 cửa", href: "/products?cat=tu-lanh&type=2-cua" },
        { label: "3-4 cửa", href: "/products?cat=tu-lanh&type=3-4-cua" },
        { label: "Side by Side", href: "/products?cat=tu-lanh&type=side-by-side" },
        { label: "French Door", href: "/products?cat=tu-lanh&type=french-door" },
      ],
    },
    {
      title: "Thương hiệu",
      items: [
        { label: "Samsung", href: "/products?cat=tu-lanh&brand=samsung" },
        { label: "LG", href: "/products?cat=tu-lanh&brand=lg" },
        { label: "Panasonic", href: "/products?cat=tu-lanh&brand=panasonic" },
        { label: "Toshiba", href: "/products?cat=tu-lanh&brand=toshiba" },
      ],
    },
  ],
  "may-giat": [
    {
      title: "Loại máy",
      items: [
        { label: "Cửa trước (lồng ngang)", href: "/products?cat=may-giat&type=long-ngang" },
        { label: "Cửa trên (lồng đứng)", href: "/products?cat=may-giat&type=long-dung" },
        { label: "Máy giặt sấy", href: "/products?cat=may-giat&type=giat-say" },
      ],
    },
    {
      title: "Khối lượng giặt",
      items: [
        { label: "Dưới 8kg", href: "/products?cat=may-giat&kg=lt8" },
        { label: "8 - 10kg", href: "/products?cat=may-giat&kg=8-10" },
        { label: "Trên 10kg", href: "/products?cat=may-giat&kg=gt10" },
      ],
    },
    {
      title: "Thương hiệu",
      items: [
        { label: "LG", href: "/products?cat=may-giat&brand=lg" },
        { label: "Samsung", href: "/products?cat=may-giat&brand=samsung" },
        { label: "Toshiba", href: "/products?cat=may-giat&brand=toshiba" },
        { label: "Electrolux", href: "/products?cat=may-giat&brand=electrolux" },
      ],
    },
  ],
  "dieu-hoa": [
    {
      title: "Công suất (HP)",
      items: [
        { label: "1 HP", href: "/products?cat=dieu-hoa&hp=1" },
        { label: "1.5 HP", href: "/products?cat=dieu-hoa&hp=1.5" },
        { label: "2 HP", href: "/products?cat=dieu-hoa&hp=2" },
      ],
    },
    {
      title: "Tính năng",
      items: [
        { label: "1 chiều", href: "/products?cat=dieu-hoa&mode=1-chieu" },
        { label: "2 chiều", href: "/products?cat=dieu-hoa&mode=2-chieu" },
        { label: "Inverter", href: "/products?cat=dieu-hoa&feature=inverter" },
        { label: "Lọc không khí", href: "/products?cat=dieu-hoa&feature=loc-khong-khi" },
      ],
    },
    {
      title: "Thương hiệu",
      items: [
        { label: "Daikin", href: "/products?cat=dieu-hoa&brand=daikin" },
        { label: "Panasonic", href: "/products?cat=dieu-hoa&brand=panasonic" },
        { label: "LG", href: "/products?cat=dieu-hoa&brand=lg" },
        { label: "Gree", href: "/products?cat=dieu-hoa&brand=gree" },
      ],
    },
  ],
  "quat-mat": [
    {
      title: "Loại quạt",
      items: [
        { label: "Quạt đứng", href: "/products?cat=quat-mat&type=quat-dung" },
        { label: "Quạt trần", href: "/products?cat=quat-mat&type=quat-tran" },
        { label: "Quạt điều hòa", href: "/products?cat=quat-mat&type=quat-dieu-hoa" },
        { label: "Quạt để bàn", href: "/products?cat=quat-mat&type=quat-ban" },
      ],
    },
    {
      title: "Tính năng",
      items: [
        { label: "Inverter", href: "/products?cat=quat-mat&feature=inverter" },
        { label: "Điều khiển từ xa", href: "/products?cat=quat-mat&feature=remote" },
        { label: "Hẹn giờ", href: "/products?cat=quat-mat&feature=hen-gio" },
      ],
    },
    {
      title: "Thương hiệu",
      items: [
        { label: "Panasonic", href: "/products?cat=quat-mat&brand=panasonic" },
        { label: "Senko", href: "/products?cat=quat-mat&brand=senko" },
        { label: "Xiaomi", href: "/products?cat=quat-mat&brand=xiaomi" },
      ],
    },
  ],
  "may-massage": [
    {
      title: "Loại thiết bị",
      items: [
        { label: "Ghế massage", href: "/products?cat=may-massage&type=ghe" },
        { label: "Súng massage", href: "/products?cat=may-massage&type=sung" },
        { label: "Đai/Đệm massage", href: "/products?cat=may-massage&type=dai-dem" },
      ],
    },
    {
      title: "Khu vực sử dụng",
      items: [
        { label: "Cổ vai gáy", href: "/products?cat=may-massage&area=co-vai-gay" },
        { label: "Lưng", href: "/products?cat=may-massage&area=lung" },
        { label: "Chân", href: "/products?cat=may-massage&area=chan" },
      ],
    },
    {
      title: "Thương hiệu",
      items: [
        { label: "Kingsport", href: "/products?cat=may-massage&brand=kingsport" },
        { label: "ELIP", href: "/products?cat=may-massage&brand=elip" },
        { label: "Xiaomi", href: "/products?cat=may-massage&brand=xiaomi" },
      ],
    },
  ],
  "tivi": [
    {
      title: "Kích thước",
      items: [
        { label: "32-43 inch", href: "/products?cat=tivi&size=32-43" },
        { label: "50-55 inch", href: "/products?cat=tivi&size=50-55" },
        { label: "65+ inch", href: "/products?cat=tivi&size=65plus" },
      ],
    },
    {
      title: "Công nghệ",
      items: [
        { label: "OLED", href: "/products?cat=tivi&type=oled" },
        { label: "QLED", href: "/products?cat=tivi&type=qled" },
        { label: "Mini LED", href: "/products?cat=tivi&type=miniled" },
      ],
    },
    {
      title: "Thương hiệu",
      items: [
        { label: "Samsung", href: "/products?cat=tivi&brand=samsung" },
        { label: "LG", href: "/products?cat=tivi&brand=lg" },
        { label: "Sony", href: "/products?cat=tivi&brand=sony" },
      ],
    },
  ],
  "gia-dung": [
    {
      title: "Nhóm thiết bị",
      items: [
        { label: "Nồi chiên", href: "/products?cat=do-gia-dung&type=noi-chien" },
        { label: "Lò vi sóng", href: "/products?cat=do-gia-dung&type=lo-vi-song" },
        { label: "Máy hút bụi", href: "/products?cat=do-gia-dung&type=hut-bui" },
        { label: "Bếp điện", href: "/products?cat=do-gia-dung&type=bep-dien" },
      ],
    },
    {
      title: "Thương hiệu",
      items: [
        { label: "Philips", href: "/products?cat=do-gia-dung&brand=philips" },
        { label: "Panasonic", href: "/products?cat=do-gia-dung&brand=panasonic" },
        { label: "Sharp", href: "/products?cat=do-gia-dung&brand=sharp" },
      ],
    },
  ],
}

export function CategoryGrid({ inlinePanel = false }: CategoryGridProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  return (
    <aside className="mx-auto w-full max-w-xs">
      <div className="relative flex">
        <div className="rounded-2xl border border-border bg-card p-2 shadow-card">
          <nav className="flex flex-col divide-y divide-border">
        {ITEMS.map((i) => (
              <button
                key={i.key}
                type="button"
                onClick={() => setActiveKey((prev) => (prev === i.key ? null : i.key))}
                onMouseEnter={() => setHoveredKey(i.key)}
                onMouseLeave={() => setHoveredKey(null)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:shadow-sm ${activeKey === i.key ? "bg-accent/60 text-foreground shadow-sm" : ""}`}
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-input bg-background text-sm transition-colors group-hover:border-accent group-hover:scale-110">{i.icon}</span>
                <span className="flex-1 text-sm font-medium text-foreground">{i.label}</span>
                <span className="text-muted-foreground group-hover:text-current transition-transform group-hover:translate-x-0.5">›</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Submenu panel */}
        {(activeKey || hoveredKey) && !inlinePanel && (
          <div
            className="absolute right-full top-0 z-20 mr-3 w-[840px] max-w-[78vw] rounded-2xl border border-border bg-card p-6 shadow-xl animate-in slide-in-from-right-2 duration-200"
            onMouseEnter={() => setHoveredKey(activeKey)}
            onMouseLeave={() => setHoveredKey(null)}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {ITEMS.find(item => item.key === (activeKey || hoveredKey))?.label}
              </h3>
              <Link 
                href={`/products?cat=${activeKey || hoveredKey}`} 
                className="rounded-lg border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Xem tất cả →
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-8">
              {(SUB_MENUS[activeKey || hoveredKey || ''] || []).map((section: { title: string; items: { label: string; href: string }[] }) => (
                <div key={section.title} className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                    {section.title}
                  </h4>
                  <div className="space-y-2">
                    {section.items.map((it: { label: string; href: string }) => (
                      <Link
                        key={it.label}
                        href={it.href}
                        className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors hover:translate-x-1"
                      >
                        {it.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeKey && inlinePanel && (
          <div className="mt-4 rounded-2xl border border-border bg-card p-6 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {ITEMS.find(item => item.key === activeKey)?.label}
              </h3>
              <Link 
                href={`/products?cat=${activeKey}`} 
                className="rounded-lg border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Xem tất cả →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(SUB_MENUS[activeKey || ''] || []).map((section: { title: string; items: { label: string; href: string }[] }) => (
                <div key={section.title} className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                    {section.title}
                  </h4>
                  <div className="space-y-2">
                    {section.items.map((it: { label: string; href: string }) => (
                      <Link
                        key={it.label}
                        href={it.href}
                        className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors hover:translate-x-1"
                      >
                        {it.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
export default CategoryGrid
