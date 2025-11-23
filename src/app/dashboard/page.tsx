"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Order, getOrders } from "@/services/order";
import { OrderCard } from "@/components/OrderCard";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { customer, isAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadOrders = async (pageNum: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      setError("");
      
      const newOrders = await getOrders({
        page: pageNum,
        pageSize: 10,
        customerId: customer?.id,
        includeItems: false
      });

      if (append) {
        setOrders(prev => [...prev, ...newOrders]);
      } else {
        setOrders(newOrders);
      }

      setHasMore(newOrders.length === 10);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/signin");
      return;
    }
    if (isAuthenticated) {
      loadOrders(1, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading]);

  const handleRefresh = () => {
    setPage(1);
    loadOrders(1, false);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadOrders(nextPage, true);
  };


  // Calculate statistics
  const totalOrders = orders.length;
  const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const paidOrders = orders.filter(order => order.status.toLowerCase() === "paid").length;
  const pendingOrders = orders.filter(order => order.status.toLowerCase() === "pending").length;

  if (authLoading) {
    return (
      <>
        <section className="overflow-hidden pt-32 pb-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-1 p-6 h-32"></div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <section className="overflow-hidden pt-32 pb-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div>
              <h1 className="font-semibold text-xl sm:text-2xl xl:text-custom-3 text-dark mb-1">
                Đơn hàng
              </h1>
              <p className="text-custom-sm text-dark-4">
                Chào mừng, {customer?.fullName || customer?.username || "Người dùng"}!
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center gap-2 font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed mt-4 sm:mt-0"
            >
              <svg
                className={`fill-current w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 0C3.582 0 0 3.582 0 8C0 12.418 3.582 16 8 16C12.418 16 16 12.418 16 8C16 3.582 12.418 0 8 0ZM8 14C4.686 14 2 11.314 2 8C2 4.686 4.686 2 8 2C11.314 2 14 4.686 14 8C14 11.314 11.314 14 8 14Z"
                  fill="currentColor"
                />
                <path
                  d="M8 4V8L11 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Làm mới
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-1 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue/10 rounded-lg">
                  <svg
                    className="fill-current text-blue"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 6H16L14 4H10L8 6H4C2.9 6 2 6.9 2 8V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V8C22 6.9 21.1 6 20 6ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.35 9 9 10.35 9 12C9 13.65 10.35 15 12 15C13.65 15 15 13.65 15 12C15 10.35 13.65 9 12 9Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-custom-sm font-medium text-dark-4 mb-1">Tổng đơn hàng</p>
                  <p className="text-2xl font-bold text-dark">{totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-1 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <svg
                    className="fill-current text-primary-600"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                      fill="currentColor"
                    />
                    <path
                      d="M12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4ZM12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-custom-sm font-medium text-dark-4 mb-1">Tổng giá trị</p>
                  <p className="text-2xl font-bold text-dark">{formatCurrency(totalAmount, "VND")}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-1 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <svg
                    className="fill-current text-yellow-600"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-custom-sm font-medium text-dark-4 mb-1">Chờ xử lý</p>
                  <p className="text-2xl font-bold text-dark">{pendingOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-1 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <svg
                    className="fill-current text-primary-600"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-custom-sm font-medium text-dark-4 mb-1">Đã thanh toán</p>
                  <p className="text-2xl font-bold text-dark">{paidOrders}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="bg-white rounded-xl shadow-1">
            <div className="px-6 py-4 border-b border-gray-3">
              <h2 className="font-semibold text-lg text-dark">Danh sách đơn hàng</h2>
            </div>

            <div className="p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {loading && orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue mx-auto"></div>
                  <p className="mt-2 text-dark-4">Đang tải danh sách đơn hàng...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="h-12 w-12 text-dark-4 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-dark mb-2">Chưa có đơn hàng</h3>
                  <p className="text-dark-4 mb-4">Bạn chưa có đơn hàng nào.</p>
                  <button
                    onClick={() => router.push("/shop-with-sidebar")}
                    className="inline-flex font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
                  >
                    Mua sắm ngay
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                    />
                  ))}

                  {hasMore && (
                    <div className="text-center pt-6">
                      <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        className="inline-flex items-center gap-2 font-medium text-dark border border-gray-3 bg-white py-3 px-6 rounded-md ease-out duration-200 hover:bg-gray-1 hover:border-blue disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue"></div>
                            Đang tải...
                          </>
                        ) : (
                          "Tải thêm"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
