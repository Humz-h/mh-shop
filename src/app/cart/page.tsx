"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, Trash2 } from "@/components/UI/icons";
import Link from "next/link";

function getInitialCartFromQuery(): { id: number; name: string; price: number; image?: string; quantity: number }[] {
  if (typeof window === "undefined") return []
  const url = new URL(window.location.href)
  const id = url.searchParams.get("id")
  const name = url.searchParams.get("name")
  const price = url.searchParams.get("price")
  const image = url.searchParams.get("image") || undefined
  if (id && name && price) {
    return [{ id: Number(id), name, price: Number(price), image, quantity: 1 }]
  }
  return []
}

export default function CartPage() {
  const [items, setItems] = useState(getInitialCartFromQuery());

  // hydrate from localStorage if available
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = localStorage.getItem("cart")
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) setItems(parsed)
      }
    } catch {}
  }, []);

  // keep localStorage in sync
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem("cart", JSON.stringify(items))
    } catch {}
  }, [items]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 50000;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng của bạn</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Sản phẩm ({items.length})
              </h2>
              
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-center space-x-4 py-4">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    {index < items.length - 1 && <hr className="border-gray-200" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-card p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Tóm tắt đơn hàng
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-medium">{formatPrice(shipping)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                  <span className="text-lg font-bold text-brandBlue">{formatPrice(total)}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <button className="w-full bg-brandBlue text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Thanh toán
                </button>
                <Link 
                  href="/products" 
                  className="block w-full text-center text-brandBlue py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 