import { apiFetch } from "@/lib/api";

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderDetail {
  id?: number;
  productId?: number;
  productName?: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
}

// API Response format từ server
export interface ApiOrderResponse {
  id: number;
  userId: number;
  totalPrice: number;
  paymentMethod: string;
  status: string;
  address: string;
  phone: string;
  createdAt: string;
  orderDetails: OrderDetail[];
}

// Internal Order format cho app
export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName: string;
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  placedAt: string;
  orderItems: OrderItem[];
  // Additional fields from API
  address?: string;
  phone?: string;
  paymentMethod?: string;
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
  customerId?: number;
  includeItems?: boolean;
}

export async function getOrders(params: GetOrdersParams = {}): Promise<Order[]> {
  const {
    page = 1,
    pageSize = 20,
    customerId,
    includeItems = false
  } = params;

  const searchParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    includeItems: includeItems.toString(),
  });

  if (customerId) {
    searchParams.append('customerId', customerId.toString());
  }

  try {
    const apiResponse = await apiFetch<ApiOrderResponse[]>(`/api/Orders?${searchParams.toString()}`, {
      method: "GET",
    });
    
    // Map từ API response sang Order format
    return apiResponse.map((apiOrder): Order => {
      // Normalize status (convert "Pending" -> "pending")
      const normalizedStatus = apiOrder.status.toLowerCase() as Order["status"];
      
      // Map orderDetails to orderItems
      const orderItems: OrderItem[] = (apiOrder.orderDetails || []).map((detail, index) => ({
        id: detail.id || index,
        productId: detail.productId || 0,
        productName: detail.productName || "",
        quantity: detail.quantity || 0,
        unitPrice: detail.unitPrice || 0,
        totalPrice: detail.totalPrice || 0,
      }));

      return {
        id: apiOrder.id,
        orderNumber: `ORD-${apiOrder.id.toString().padStart(6, '0')}`,
        customerId: apiOrder.userId,
        customerName: "", // API không trả về customerName
        totalAmount: apiOrder.totalPrice,
        shippingFee: 0, // API không trả về shippingFee
        discountAmount: 0, // API không trả về discountAmount
        status: normalizedStatus,
        placedAt: apiOrder.createdAt,
        orderItems: orderItems,
        address: apiOrder.address,
        phone: apiOrder.phone,
        paymentMethod: apiOrder.paymentMethod,
      };
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      }
      throw err;
    }
    throw new Error("Không thể lấy danh sách đơn hàng");
  }
}

export async function getOrderById(orderId: number): Promise<Order> {
  try {
    const response = await apiFetch<Order>(`/api/Orders/${orderId}`, {
      method: "GET",
    });
    return response;
  } catch (err: unknown) {
    console.error("Error fetching order:", err);
    throw new Error("Không thể lấy thông tin đơn hàng");
  }
}

export function getStatusText(status: string): string {
  const normalizedStatus = status.toLowerCase();
  const statusMap: Record<string, string> = {
    pending: "Chờ xử lý",
    paid: "Đã thanh toán",
    shipped: "Đang giao hàng",
    delivered: "Đã giao hàng",
    cancelled: "Đã hủy",
    canceled: "Đã hủy"
  };
  return statusMap[normalizedStatus] || status;
}

export function getStatusColor(status: string): string {
  const normalizedStatus = status.toLowerCase();
  const colorMap: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    shipped: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    canceled: "bg-red-100 text-red-800"
  };
  return colorMap[normalizedStatus] || "bg-gray-100 text-gray-800";
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

export interface CreateOrderRequest {
  userId?: number;
  customerId?: number;
  fullName: string;
  phone: string;
  address: string;
  paymentMethod: "COD" | "BANK_TRANSFER";
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;
}

export interface CreateOrderResponse {
  success?: boolean;
  message?: string;
  data?: Order;
  orderId?: number;
}

export async function createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
  try {
    const response = await apiFetch<CreateOrderResponse>("/api/Orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
    return response;
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      }
      throw err;
    }
    throw new Error('Có lỗi xảy ra khi tạo đơn hàng');
  }
}

