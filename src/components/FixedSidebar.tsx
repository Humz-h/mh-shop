"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

interface FixedSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const CATEGORIES = [
  { name: "Hàng chuẩn, giá mê", href: "/products?cat=hang-chuan" },
  { name: "Điện tử, điện máy", href: "/products?cat=dien-tu-dien-may" },
  { name: "Điện gia dụng", href: "/products?cat=dien-gia-dung" },
  { name: "Điện tử, Viễn thông", href: "/products?cat=dien-tu-vien-thong" },
  { name: "Làm đẹp, chăm sóc cá nhân", href: "/products?cat=lam-dep" },
  { name: "Đồ gia dụng", href: "/products?cat=do-gia-dung" },
  { name: "Phụ kiện", href: "/products?cat=phu-kien" },
  { name: "Máy cũ, trưng bày", href: "/products?cat=may-cu" },
  { name: "Sản phẩm khác", href: "/products?cat=san-pham-khac" },
  { name: "Thông tin - Dịch vụ tiện ích", href: "/products?cat=thong-tin-dich-vu" },
]

const HOT_PROGRAMS = [
  {
    image: "/134e7ced5b22a7296a3472125c3f6891.png",
    title: "FLASH SALE",
    description: "Flash sale giảm đến 50%",
    href: "/products?promo=flash-sale"
  },
  {
    image: "/171d15e0ec1f19c11d65880b3b9681f4.png",
    title: "Máy giặt giảm đến 6 triệu",
    description: "Máy giặt giảm đến 6 triệu",
    href: "/products?cat=may-giat&promo=6-trieu"
  },
  {
    image: "/ad41eb1eb048708e8b68d38f28e56e18.png",
    title: "Hàng cao cấp giảm đến 50%",
    description: "Hàng cao cấp giảm đến 50%",
    href: "/products?promo=hang-cao-cap"
  },
  {
    image: "/84ee8768df2aa0e32f116dd550e8d156.png",
    title: "Máy lọc nước giảm đến 46%",
    description: "Máy lọc nước giảm đến 46%",
    href: "/products?cat=may-loc-nuoc&promo=46"
  },
  {
    image: "/95e06291048a2f1e783c5da90380ea6b.png",
    title: "XẢ KHO GIÁ SỐC",
    description: "Xả kho giá sốc",
    href: "/products?promo=xa-kho"
  },
  {
    image: "/134e7ced5b22a7296a3472125c3f6891.png",
    title: "HÀNG TIỆN ÍCH GIÁ THẬT THÍCH",
    description: "Hàng tiện ích - Giá thật thích",
    href: "/products?cat=hang-tien-ich"
  },
  {
    image: "/171d15e0ec1f19c11d65880b3b9681f4.png",
    title: "Mua bếp điện, tặng bộ nồi",
    description: "Mua bếp điện, tặng bộ nồi",
    href: "/products?cat=bep-dien&promo=tang-noi"
  },
  {
    image: "/ad41eb1eb048708e8b68d38f28e56e18.png",
    title: "Mua nồi cơm tặng bàn ủi",
    description: "Mua nồi cơm tặng bàn ủi",
    href: "/products?cat=noi-com&promo=tang-ban-ui"
  },
  {
    image: "/84ee8768df2aa0e32f116dd550e8d156.png",
    title: "Mua tủ lạnh tặng quà (tùy model)",
    description: "Mua tủ lạnh tặng quà (tùy model)",
    href: "/products?cat=tu-lanh&promo=tang-qua"
  },
  {
    image: "/95e06291048a2f1e783c5da90380ea6b.png",
    title: "Mua tivi >55\" tặng quà (tuỳ model)",
    description: "Mua tivi >55\" tặng quà (tuỳ model)",
    href: "/products?cat=tivi&size=55plus&promo=tang-qua"
  },
  {
    image: "/134e7ced5b22a7296a3472125c3f6891.png",
    title: "Chăm sóc sức khỏe - làm đẹp",
    description: "Chăm sóc sức khỏe - làm đẹp",
    href: "/products?cat=cham-soc-suc-khoe"
  },
  {
    image: "/171d15e0ec1f19c11d65880b3b9681f4.png",
    title: "DỤNG CỤ NHÀ BẾP GIẢM ĐẾN 50%",
    description: "Nhà bếp giảm đến 50%",
    href: "/products?cat=dung-cu-nha-bep&promo=50"
  },
  {
    image: "/ad41eb1eb048708e8b68d38f28e56e18.png",
    title: "Xe đạp mua Online vượt trội",
    description: "Xe đạp mua Online vượt trội",
    href: "/products?cat=xe-dap&promo=online"
  },
  {
    image: "/84ee8768df2aa0e32f116dd550e8d156.png",
    title: "Xay ép hàng hiệu Vượt Trội",
    description: "Xay ép hàng hiệu Vượt Trội",
    href: "/products?cat=xay-ep&promo=hang-hieu"
  },
  {
    image: "/95e06291048a2f1e783c5da90380ea6b.png",
    title: "GIA DỤNG LẮP ĐẶT ƯU ĐÃI NGẬP TRÀN",
    description: "Gia dụng lắp đặt giảm đến 50%",
    href: "/products?cat=gia-dung-lap-dat&promo=50"
  },
]

export function FixedSidebar({ isOpen, onClose }: FixedSidebarProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 shadow-xl z-40 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
      {/* Categories Section */}
      <div className="p-6">
        <div className="space-y-1">
          {CATEGORIES.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className={`block px-4 py-4 text-sm font-medium transition-all duration-200 border-l-4 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-500 rounded-r-lg ${
                hoveredCategory === category.name 
                  ? 'bg-blue-50 text-blue-600 border-blue-500' 
                  : 'text-gray-700 hover:text-gray-900 border-transparent'
              }`}
              onMouseEnter={() => setHoveredCategory(category.name)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Hot Programs Section */}
      <div className="border-t border-gray-200 p-6 bg-gradient-to-b from-gray-50 to-white">
        <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
          CHƯƠNG TRÌNH HOT
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {HOT_PROGRAMS.map((program, index) => (
            <Link
              key={index}
              href={program.href}
              className="group p-3 rounded-lg border border-gray-200 hover:border-green-400 hover:shadow-md transition-all duration-300 bg-white hover:bg-green-50"
            >
              <div className="text-center">
                <div className="relative w-12 h-12 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                  <Image 
                    src={program.image} 
                    alt={program.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="text-xs font-bold text-gray-800 mb-1 leading-tight group-hover:text-green-600">
                  {program.title}
                </div>
                <div className="text-xs text-gray-600 leading-tight group-hover:text-green-500">
                  {program.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      </div>
    </>
  )
}
