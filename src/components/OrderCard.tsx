"use client";

import { Order, getStatusText, getStatusColor, formatCurrency, formatDate } from "@/services/order";
import { Badge } from "@/components/UI/badge";

interface OrderCardProps {
  order: Order;
  onViewDetails?: (orderId: number) => void;
}

export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const finalAmount = order.totalAmount + (order.shippingFee || 0) - (order.discountAmount || 0);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {order.orderNumber || `Đơn hàng #${order.id}`}
          </h3>
          <p className="text-sm text-gray-500">
            Đặt ngày: {formatDate(order.placedAt)}
          </p>
          {order.address && (
            <p className="text-xs text-gray-500 mt-1">
              📍 {order.address}
            </p>
          )}
        </div>
        <Badge className={`px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
          {getStatusText(order.status)}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tổng tiền hàng:</span>
          <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
        </div>
        {(order.shippingFee || 0) > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Phí vận chuyển:</span>
            <span className="font-medium">{formatCurrency(order.shippingFee || 0)}</span>
          </div>
        )}
        {(order.discountAmount || 0) > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Giảm giá:</span>
            <span className="font-medium text-green-600">
              -{formatCurrency(order.discountAmount || 0)}
            </span>
          </div>
        )}
        {order.paymentMethod && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Phương thức:</span>
            <span className="font-medium">
              {order.paymentMethod === "COD" ? "Thanh toán khi nhận hàng" : "Chuyển khoản"}
            </span>
          </div>
        )}
        <div className="border-t pt-2">
          <div className="flex justify-between text-base font-semibold">
            <span>Thành tiền:</span>
            <span className="text-brandBlue">
              {formatCurrency(finalAmount)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {order.orderItems?.length || 0} sản phẩm
        </div>
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(order.id)}
            className="text-brandBlue hover:text-blue-700 text-sm font-medium transition-colors"
          >
            Xem chi tiết
          </button>
        )}
      </div>
    </div>
  );
}

