"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/UI/Button";
import { Badge } from "@/components/UI/badge";
import { Heart, ShoppingCart, Menu, User, LogOut, Settings } from "@/components/UI/icons";
import CategoryMenu from "@/components/CategoryGridVN";
import { FixedSidebar } from "@/components/FixedSidebar";
import { useAuth } from "@/hooks/useAuth";
import { LogoutButton } from "@/components/LogoutButton";

export function Header() {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserDropdownOpen) {
        const target = event.target as Element;
        if (!target.closest('.user-dropdown')) {
          setIsUserDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);


  return (
    <>
      <FixedSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-green-600 text-white py-2 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <div className="flex-1">
              <div className="animate-marquee whitespace-nowrap">
                <span className="inline-block mr-8">Hàng chuẩn, giá mê</span>
                <span className="inline-block mr-8">Miễn phí vận chuyển cho đơn hàng trên 500.000₫</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-xl">VN</div>
            <span className="font-bold text-2xl text-gray-800 hidden sm:block">MH Shop</span>
          </Link>

          {/* Categories with click-to-open panel */}
          <div className="relative">
            <Button 
              variant="outline" 
              className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                isSidebarOpen 
                  ? 'bg-green-50 border-green-300 text-green-700' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-4 w-4" />
              Danh mục
            </Button>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl relative">
            <div className="relative">
              <input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-4 pr-24 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Button 
                size="sm" 
                className="absolute right-1 top-1/2 -translate-y-1/2 px-6 bg-green-600 hover:bg-green-700 text-white"
              >
                Tìm
              </Button>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-green-600 hover:bg-green-50">
              <Heart className="h-5 w-5" />
              <span className="hidden lg:block">Yêu thích</span>
            </Button>

            {/* User Section */}
            {isAuthenticated ? (
              <div className="relative user-dropdown">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 text-sm px-3 py-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:block">{user?.name}</span>
                </button>

                {/* User Dropdown */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="font-semibold text-gray-900">{user?.name}</div>
                      <div className="text-sm text-gray-500">{user?.email}</div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        Thông tin tài khoản
                      </Link>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <LogoutButton 
                        variant="danger"
                        className="w-full text-left justify-start px-4 py-2"
                        onClick={() => setIsUserDropdownOpen(false)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="flex items-center gap-2 text-sm px-3 py-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors">
                <User className="h-5 w-5" />
                <span className="hidden sm:block">Đăng nhập</span>
              </Link>
            )}

            {/* Shopping cart */}
            <Link href="/cart" className="relative flex items-center gap-2 text-sm px-3 py-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors">
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden lg:block">Giỏ hàng</span>
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-green-600 text-white">
                0
              </Badge>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation categories */}
      {/* <div className="border-t border-border">
        <div className="container mx-auto px-4 py-2">
          <nav className="flex items-center gap-6 text-sm overflow-x-auto">
            <a href="#" className="whitespace-nowrap hover:text-primary transition-colors">
              Hôm nay
            </a>
            <a href="#" className="whitespace-nowrap hover:text-primary transition-colors">
              Bán chạy
            </a>
            <Link href="/products" className="whitespace-nowrap hover:text-primary transition-colors">
              Điện thoại
            </Link>
            <a href="#" className="whitespace-nowrap hover:text-primary transition-colors">
              Laptop
            </a>
            <a href="#" className="whitespace-nowrap hover:text-primary transition-colors">
              Thời trang nam
            </a>
            <a href="#" className="whitespace-nowrap hover:text-primary transition-colors">
              Thời trang nữ
            </a>
            <a href="#" className="whitespace-nowrap hover:text-primary transition-colors">
              Nhà cửa
            </a>
            <a href="#" className="whitespace-nowrap hover:text-primary transition-colors">
              Sách
            </a>
          </nav>
        </div>
      </div> */}
      </header>
    </>
  );
} 