"use client";

import { Order, getStatusText, formatDate } from "@/services/order";
import { formatCurrency } from "@/lib/utils";

interface OrderCardProps {
  order: Order;
  onViewDetails?: (orderId: number) => void;
}

export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const finalAmount = order.totalAmount + (order.shippingFee || 0) - (order.discountAmount || 0);
  
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
        <div className="border-t border-gray-3 pt-2 mt-2">
          <div className="flex justify-between text-base font-semibold">
            <span className="text-dark">Thành tiền:</span>
            <span className="text-blue">
              {formatCurrency(finalAmount, "VND")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-custom-sm text-dark-4">
          {order.orderItems?.length || 0} sản phẩm
        </div>
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(order.id)}
            className="text-blue hover:text-blue-dark text-sm font-medium transition-colors ease-out duration-200"
          >
            Xem chi tiết →
          </button>
        )}
      </div>
    </div>
  );
}
