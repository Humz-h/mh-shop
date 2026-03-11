"use client";

import { useState } from "react";
import { Order, getStatusText, formatDate, getOrderDetails, OrderDetailItem } from "@/services/order";
import { formatCurrency, getImageUrl } from "@/lib/utils";
import Image from "next/image";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetailItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const finalAmount = order.totalAmount + (order.shippingFee || 0) - (order.discountAmount || 0);

  const handleViewDetails = async () => {
    if (showDetails) {
      setShowDetails(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const details = await getOrderDetails(order.id);
      setOrderDetails(details);
      setShowDetails(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải chi tiết đơn hàng");
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusBadgeClass = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "paid" || statusLower === "completed") {
      return "bg-primary-100 text-primary-600";
    } else if (statusLower === "pending") {
      return "bg-yellow-100 text-yellow-600";
    } else if (statusLower === "cancelled" || statusLower === "cancelled") {
      return "bg-red-100 text-red-600";
    }
    return "bg-gray-1 text-dark";
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-3 p-6 hover:shadow-1 transition-shadow ease-out duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-dark mb-2">
            {order.orderNumber || `Đơn hàng #${order.id}`}
          </h3>
          <div className="space-y-1">
            <p className="text-custom-sm text-dark-4">
              Đặt ngày: {formatDate(order.placedAt)}
            </p>
            {order.address && (
              <p className="text-custom-sm text-dark-4">
                📍 {order.address}
              </p>
            )}
          </div>
        </div>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
          {getStatusText(order.status)}
        </div>
      </div>

      <div className="space-y-2 mb-4 pb-4 border-b border-gray-3">
        <div className="flex justify-between text-custom-sm">
          <span className="text-dark-4">Tổng tiền hàng:</span>
          <span className="font-medium text-dark">{formatCurrency(order.totalAmount, "VND")}</span>
        </div>
        {(order.shippingFee || 0) > 0 && (
          <div className="flex justify-between text-custom-sm">
            <span className="text-dark-4">Phí vận chuyển:</span>
            <span className="font-medium text-dark">{formatCurrency(order.shippingFee || 0, "VND")}</span>
          </div>
        )}
        {(order.discountAmount || 0) > 0 && (
          <div className="flex justify-between text-custom-sm">
            <span className="text-dark-4">Giảm giá:</span>
            <span className="font-medium text-primary-600">
              -{formatCurrency(order.discountAmount || 0, "VND")}
            </span>
          </div>
        )}
        {order.paymentMethod && (
          <div className="flex justify-between text-custom-sm">
            <span className="text-dark-4">Phương thức:</span>
            <span className="font-medium text-dark">
              {order.paymentMethod === "COD" ? "Thanh toán khi nhận hàng" : "Chuyển khoản"}
            </span>
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-base font-semibold">
          <span className="text-dark">Thành tiền:</span>
          <span className="text-blue">
            {formatCurrency(finalAmount, "VND")}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-custom-sm text-dark-4">
          {(order.orderItems?.length ?? (showDetails ? orderDetails.length : undefined) ?? 0)} sản phẩm
        </div>
        <button
          onClick={handleViewDetails}
          disabled={loading}
          className="text-blue hover:text-blue-dark text-sm font-medium transition-colors ease-out duration-200 disabled:opacity-50"
        >
          {loading ? "Đang tải..." : showDetails ? "Ẩn chi tiết ↑" : "Xem chi tiết ↓"}
        </button>
      </div>

      {showDetails && (
        <div className="mt-6 pt-6 border-t border-gray-3">
          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Thông tin liên hệ */}
              <div className="bg-gray-1 rounded-lg p-6 space-y-4">
                <h4 className="font-semibold text-lg text-dark mb-4">Thông tin giao hàng</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.phone && (
                    <div>
                      <p className="text-sm text-dark-4 mb-1">Số điện thoại:</p>
                      <p className="font-medium text-dark">{order.phone}</p>
                    </div>
                  )}
                  {order.address && (
                    <div>
                      <p className="text-sm text-dark-4 mb-1">Địa chỉ:</p>
                      <p className="font-medium text-dark">{order.address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Chi tiết sản phẩm */}
              <div>
                <h4 className="font-semibold text-lg text-dark mb-4">Chi tiết sản phẩm</h4>
                <div className="space-y-4">
                  {orderDetails.map((detail) => (
                    <div
                      key={detail.id}
                      className="bg-white border border-gray-3 rounded-lg p-6 hover:shadow-1 transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row gap-6">
                        {/* Hình ảnh sản phẩm */}
                        <div className="flex-shrink-0">
                          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-lg overflow-hidden bg-gray-1">
                            <Image
                              src={getImageUrl(detail.product.imageUrl)}
                              alt={detail.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>

                        {/* Thông tin sản phẩm */}
                        <div className="flex-1 space-y-3">
                          <div>
                            <h5 className="font-semibold text-lg text-dark mb-1">
                              {detail.product.name}
                            </h5>
                            {detail.product.productCode && (
                              <p className="text-sm text-dark-4">Mã: {detail.product.productCode}</p>
                            )}
                          </div>

                          {detail.product.description && (
                            <p className="text-sm text-dark-4 line-clamp-2">
                              {detail.product.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 pt-2">
                            <div>
                              <p className="text-sm text-dark-4 mb-1">Số lượng:</p>
                              <p className="font-medium text-dark">{detail.quantity}</p>
                            </div>
                            <div>
                              <p className="text-sm text-dark-4 mb-1">Đơn giá:</p>
                              <p className="font-medium text-dark">
                                {formatCurrency(detail.price, "VND")}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-dark-4 mb-1">Thành tiền:</p>
                              <p className="font-semibold text-blue text-lg">
                                {formatCurrency(detail.price * detail.quantity, "VND")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
