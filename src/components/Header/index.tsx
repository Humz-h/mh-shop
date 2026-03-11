"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "@/lib/utils";
import { fetchCategoriesTree } from "@/services/category";
import type { CategoryTreeItem } from "@/types/category-tree";

function flattenCategoryTree(items: CategoryTreeItem[]): CategoryTreeItem[] {
  const result: CategoryTreeItem[] = [];
  for (const item of items) {
    if (item.isActive) {
      result.push(item);
      if (item.children?.length) {
        result.push(...flattenCategoryTree(item.children));
      }
    }
  }
  return result;
}

const Header = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [stickyMenu, setStickyMenu] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { openCartModal } = useCartModalContext();
  const { customer, isAuthenticated, logout } = useAuth();

  const product = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleOpenCartModal = () => {
    openCartModal();
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!searchQuery.trim()) return;
    router.push(`/search?keyword=${encodeURIComponent(searchQuery.trim())}`);
  };

  // Sticky menu
  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
  });

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryTreeItem[]>([]);

  useEffect(() => {
    fetchCategoriesTree()
      .then((tree) => setCategories(flattenCategoryTree(tree)))
      .catch(() => setCategories([]));
  }, []);

  // Close category menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;
      if (!target.closest(".category-dropdown")) {
        setIsCategoryMenuOpen(false);
      }
      if (!target.closest(".user-dropdown")) {
        setUserDropdownOpen(false);
      }
    }

    if (isCategoryMenuOpen || userDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCategoryMenuOpen, userDropdownOpen]);

  return (
    <header
      className={`fixed left-0 top-0 w-full z-[9999] bg-white/98 backdrop-blur-md border-b transition-all duration-300 ${
        stickyMenu ? "border-gray-200 shadow-sm" : "border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 py-4 sm:py-3 ${
            stickyMenu ? "py-3" : ""
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center order-1 sm:order-1"
          >
            <span className="text-2xl sm:text-[1.75rem] font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent hover:from-blue-700 hover:to-blue-600 transition-colors">
              MHShop
            </span>
          </Link>

          {/* Search - center on desktop */}
          <form
            onSubmit={handleSearch}
            className="flex-1 min-w-0 order-3 sm:order-2 max-w-xl mx-auto sm:mx-0 w-full"
          >
            <div className="flex rounded-lg overflow-visible border border-gray-200 hover:border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-sm">
              <div className="relative category-dropdown overflow-visible">
                <button
                  type="button"
                  onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                  className="flex items-center justify-between gap-2 h-10 px-4 bg-gray-50 border-r border-gray-200 text-sm text-gray-700 hover:bg-gray-100 transition-colors min-w-[140px] rounded-l-lg"
                >
                  <span className="truncate">Danh mục</span>
                  <svg
                    className={`w-4 h-4 flex-shrink-0 transition-transform ${isCategoryMenuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isCategoryMenuOpen && (
                  <div className="absolute top-full left-0 w-48 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg py-1 z-50 max-h-60 overflow-y-auto">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          setIsCategoryMenuOpen(false);
                          router.push(`/group?id=${category.id}`);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative flex-1 flex rounded-r-lg overflow-hidden">
                <input
                  onChange={(e) => setSearchQuery(e.target.value)}
                  value={searchQuery}
                  type="search"
                  name="search"
                  placeholder="Tìm sản phẩm..."
                  autoComplete="off"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 min-w-0 h-10 px-4 pr-11 text-sm bg-white outline-none placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  aria-label="Tìm kiếm"
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2 order-2 sm:order-3 flex-shrink-0">
            <div className="flex items-center gap-2 ml-auto sm:ml-0">
              {isAuthenticated && customer ? (
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="w-8 h-8 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center shrink-0">
                      {customer.avatarUrl ? (
                        <Image
                          src={customer.avatarUrl.startsWith("data:") || customer.avatarUrl.startsWith("http") ? customer.avatarUrl : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${customer.avatarUrl.startsWith("/") ? customer.avatarUrl : `/${customer.avatarUrl}`}`}
                          alt=""
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </span>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-800 leading-tight">
                        {customer.fullName || customer.username || "Người dùng"}
                      </p>
                      <span className="text-xs text-gray-500">Tài khoản</span>
                    </div>
                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 overflow-hidden">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Tài khoản của tôi
                      </Link>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        Đơn hàng
                      </Link>
                      <Link
                        href="/wishlist"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        Yêu thích
                      </Link>
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={() => { logout(); setUserDropdownOpen(false); }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/signin"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline">Đăng nhập</span>
                </Link>
              )}

              <button
                onClick={handleOpenCartModal}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors relative"
              >
                <span className="inline-block relative">
                  <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.5433 9.5172C15.829 9.21725 15.8174 8.74252 15.5174 8.45686C15.2175 8.17119 14.7428 8.18277 14.4571 8.48272L12.1431 10.9125L11.5433 10.2827C11.2576 9.98277 10.7829 9.97119 10.483 10.2569C10.183 10.5425 10.1714 11.0173 10.4571 11.3172L11.6 12.5172C11.7415 12.6658 11.9378 12.75 12.1431 12.75C12.3483 12.75 12.5446 12.6658 12.6862 12.5172L15.5433 9.5172Z"
                        fill="#3C50E0"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.29266 2.7512C1.43005 2.36044 1.8582 2.15503 2.24896 2.29242L2.55036 2.39838C3.16689 2.61511 3.69052 2.79919 4.10261 3.00139C4.54324 3.21759 4.92109 3.48393 5.20527 3.89979C5.48725 4.31243 5.60367 4.76515 5.6574 5.26153C5.66124 5.29706 5.6648 5.33321 5.66809 5.36996L17.1203 5.36996C17.9389 5.36995 18.7735 5.36993 19.4606 5.44674C19.8103 5.48584 20.1569 5.54814 20.4634 5.65583C20.7639 5.76141 21.0942 5.93432 21.3292 6.23974C21.711 6.73613 21.7777 7.31414 21.7416 7.90034C21.7071 8.45845 21.5686 9.15234 21.4039 9.97723L21.3935 10.0295L21.3925 10.0341L20.8836 12.5033C20.7339 13.2298 20.6079 13.841 20.4455 14.3231C20.2731 14.8346 20.0341 15.2842 19.6076 15.6318C19.1811 15.9793 18.6925 16.1226 18.1568 16.1882C17.6518 16.25 17.0278 16.25 16.2862 16.25L10.8804 16.25C9.53464 16.25 8.44479 16.25 7.58656 16.1283C6.69032 16.0012 5.93752 15.7285 5.34366 15.1022C4.79742 14.526 4.50529 13.9144 4.35897 13.0601C4.22191 12.2598 4.20828 11.2125 4.20828 9.75996V7.03832C4.20828 6.29837 4.20726 5.80316 4.16611 5.42295C4.12678 5.0596 4.05708 4.87818 3.96682 4.74609C3.87876 4.61723 3.74509 4.4968 3.44186 4.34802C3.11902 4.18961 2.68026 4.03406 2.01266 3.79934L1.75145 3.7075C1.36068 3.57012 1.15527 3.14197 1.29266 2.7512ZM5.70828 6.86996L5.70828 9.75996C5.70828 11.249 5.72628 12.1578 5.83744 12.8068C5.93933 13.4018 6.11202 13.7324 6.43219 14.0701C6.70473 14.3576 7.08235 14.5418 7.79716 14.6432C8.53783 14.7482 9.5209 14.75 10.9377 14.75H16.2406C17.0399 14.75 17.5714 14.7487 17.9746 14.6993C18.3573 14.6525 18.5348 14.571 18.66 14.469C18.7853 14.3669 18.9009 14.2095 19.024 13.8441C19.1537 13.4592 19.2623 12.9389 19.4237 12.156L19.9225 9.73591L19.9229 9.73369C20.1005 8.84376 20.217 8.2515 20.2444 7.80793C20.2704 7.38648 20.2043 7.23927 20.1429 7.15786C20.1367 7.15259 20.0931 7.11565 19.9661 7.07101C19.8107 7.01639 19.5895 6.97049 19.2939 6.93745C18.6991 6.87096 17.9454 6.86996 17.089 6.86996H5.70828Z"
                        fill="#3C50E0"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.2502 19.5C5.2502 20.7426 6.25756 21.75 7.5002 21.75C8.74285 21.75 9.7502 20.7426 9.7502 19.5C9.7502 18.2573 8.74285 17.25 7.5002 17.25C6.25756 17.25 5.2502 18.2573 5.2502 19.5ZM7.5002 20.25C7.08599 20.25 6.7502 19.9142 6.7502 19.5C6.7502 19.0857 7.08599 18.75 7.5002 18.75C7.91442 18.75 8.2502 19.0857 8.2502 19.5C8.2502 19.9142 7.91442 20.25 7.5002 20.25Z"
                        fill="#3C50E0"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.25 19.5001C14.25 20.7427 15.2574 21.7501 16.5 21.7501C17.7426 21.7501 18.75 20.7427 18.75 19.5001C18.75 18.2574 17.7426 17.2501 16.5 17.2501C15.2574 17.2501 14.25 18.2574 14.25 19.5001ZM16.5 20.2501C16.0858 20.2501 15.75 19.9143 15.75 19.5001C15.75 19.0859 16.0858 18.7501 16.5 18.7501C16.9142 18.7501 17.25 19.0859 17.25 19.5001C17.25 19.9143 16.9142 20.2501 16.5 20.2501Z"
                        fill="#3C50E0"
                      />
                    </svg>

                    {isMounted && product && product.length > 0 && (
                      <span className="flex items-center justify-center font-bold text-[10px] absolute -right-2 -top-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white shadow-md ring-2 ring-white">
                        {product.length > 99 ? "99+" : product.length}
                      </span>
                    )}
                  </span>

                  <div>
                    <span className="block text-xs text-dark-4 uppercase leading-tight">
                      giỏ hàng
                    </span>
                    <p className="font-medium text-xs text-dark leading-tight">
                      {isMounted ? formatCurrency(totalPrice, "VND") : "0 ₫"}
                    </p>
                  </div>
                </button>

              {/* <!-- Hamburger Toggle BTN --> */}
              <button
                id="Toggle"
                aria-label="Toggler"
                className="xl:hidden block"
                onClick={() => setNavigationOpen(!navigationOpen)}
              >
                <span className="block relative cursor-pointer w-5.5 h-5.5">
                  <span className="du-block absolute right-0 w-full h-full">
                    <span
                      className={`block relative top-0 left-[0px] bg-dark rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-[0] ${
                        !navigationOpen && "!w-full delay-300"
                      }`}
                    ></span>
                    <span
                      className={`block relative top-0 left-[0px] bg-dark rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-150 ${
                        !navigationOpen && "!w-full delay-400"
                      }`}
                    ></span>
                    <span
                      className={`block relative top-0 left-[0px] bg-dark rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-200 ${
                        !navigationOpen && "!w-full delay-500"
                      }`}
                    ></span>
                  </span>

                  <span className="block absolute right-0 w-full h-full rotate-45">
                    <span
                      className={`block bg-dark rounded-sm ease-in-out duration-200 delay-300 absolute left-2.5 top-0 w-0.5 h-full ${
                        !navigationOpen && "!h-0 delay-[0] "
                      }`}
                    ></span>
                    <span
                      className={`block bg-dark rounded-sm ease-in-out duration-200 delay-400 absolute left-[0px] top-2.5 w-full h-0.5 ${
                        !navigationOpen && "!h-0 dealy-200"
                      }`}
                    ></span>
                  </span>
                </span>
              </button>
              {/* //   <!-- Hamburger Toggle BTN --> */}
            </div>
          </div>
        </div>
        {/* <!-- header top end --> */}
      </div>

    </header>
  );
};

export default Header;
