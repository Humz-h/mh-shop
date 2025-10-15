import { apiFetch } from "@/lib/api";

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  userName: string;
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  placedAt: string;
  orderItems: OrderItem[];
}

export interface OrdersResponse {
  orders: Order[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface GetOrdersParams {
  page?: number;
  pageSize?: number;
  userId?: number;
  includeItems?: boolean;
}

export async function getOrders(params: GetOrdersParams = {}): Promise<Order[]> {
  const {
    page = 1,
    pageSize = 20,
    userId,
    includeItems = false
  } = params;

  const searchParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    includeItems: includeItems.toString(),
  });

  if (userId) {
    searchParams.append('userId', userId.toString());
  }

  try {
    const response = await apiFetch<Order[]>(`/api/Orders?${searchParams.toString()}`, {
      method: "GET",
    });
    return response;
  } catch (err: any) {
    console.error("Error fetching orders:", err);
    throw new Error("Không thể lấy danh sách đơn hàng");
  }
}

export async function getOrderById(orderId: number): Promise<Order> {
  try {
    const response = await apiFetch<Order>(`/api/Orders/${orderId}`, {
      method: "GET",
    });
    return response;
  } catch (err: any) {
    console.error("Error fetching order:", err);
    throw new Error("Không thể lấy thông tin đơn hàng");
  }
}

export function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "Chờ xử lý",
    paid: "Đã thanh toán",
    shipped: "Đang giao hàng",
    delivered: "Đã giao hàng",
    cancelled: "Đã hủy"
  };
  return statusMap[status] || status;
}

export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    shipped: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800"
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

