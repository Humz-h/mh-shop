"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { createOrder } from "@/services/order";
import { formatCurrency, getImageUrl } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { removeAllItemsFromCart } from "@/redux/features/cart-slice";

interface CartItem {
  id: number;
  name: string;
  title?: string;
  price: number;
  discountedPrice?: number;
  image?: string;
  imageUrl?: string;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { customer, isAuthenticated, isLoading: authLoading } = useAuth();
  // Lấy cart từ Redux store
  const reduxCartItems = useAppSelector((state) => state.cartReducer.items);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "BANK_TRANSFER">("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Load cart từ Redux store và map sang format cho checkout
  useEffect(() => {
    const mappedItems: CartItem[] = reduxCartItems.map((item) => ({
      id: item.id,
      name: item.title || "",
      title: item.title,
      price: item.discountedPrice || item.price,
      discountedPrice: item.discountedPrice,
      image: item.imgs?.previews?.[0] || item.imgs?.thumbnails?.[0],
      imageUrl: item.imgs?.previews?.[0] || item.imgs?.thumbnails?.[0],
      imgs: item.imgs,
      quantity: item.quantity,
    }));
    setCartItems(mappedItems);
  }, [reduxCartItems]);

  // Pre-fill user info if authenticated
  useEffect(() => {
    if (customer) {
      if (customer.fullName) setFullName(customer.fullName);
      if (customer.phone) setPhone(customer.phone);
    }
  }, [customer]);

  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login?redirect=/checkout");
        return;
      }
      if (cartItems.length === 0) {
        router.push("/cart");
        return;
      }
    }
  }, [authLoading, isAuthenticated, cartItems.length, router]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 50000;
  const totalPrice = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Validation
    if (!fullName.trim()) {
      setError("Vui lòng nhập họ tên");
      setLoading(false);
      return;
    }
    if (!phone.trim()) {
      setError("Vui lòng nhập số điện thoại");
      setLoading(false);
      return;
    }
    if (!address.trim()) {
      setError("Vui lòng nhập địa chỉ giao hàng");
      setLoading(false);
      return;
    }

    try {
      const orderData = {
        customerId: customer?.id,
        userId: customer?.id,
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        paymentMethod,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const result = await createOrder(orderData);

      if (result.success !== false) {
        setSuccess(true);
        // Clear cart từ Redux store
        dispatch(removeAllItemsFromCart());
        setCartItems([]);
        
        // Redirect to success page or dashboard after 2 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setError(result.message || "Đặt hàng không thành công. Vui lòng thử lại.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("401") || err.message.includes("Unauthorized")) {
          setError("Bạn cần đăng nhập để đặt hàng");
        } else if (err.message.includes("404")) {
          setError("Không tìm thấy endpoint. Vui lòng kiểm tra lại.");
        } else if (err.message.includes("500")) {
          setError("Lỗi server. Vui lòng thử lại sau.");
        } else if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
          setError("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.");
        } else {
          setError(err.message || "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
        }
      } else {
        setError("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brandBlue"></div>
      </div>
    );
  }

  if (!isAuthenticated || cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Sản phẩm trong giỏ hàng ({cartItems.length})
              </h2>
              
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-center space-x-4 py-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                        <Image
                          src={getImageUrl(item.image || item.imageUrl || item.imgs?.previews?.[0] || item.imgs?.thumbnails?.[0]) || "/placeholder.svg"}
                          alt={item.name || item.title || ""}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name || item.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatCurrency(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                    {index < cartItems.length - 1 && <hr className="border-gray-200" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Form */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Thông tin giao hàng
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Họ tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandBlue focus:border-transparent"
                    placeholder="Nhập họ tên của bạn"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandBlue focus:border-transparent"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ giao hàng <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandBlue focus:border-transparent"
                    placeholder="Nhập địa chỉ giao hàng chi tiết"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phương thức thanh toán <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={(e) => setPaymentMethod(e.target.value as "COD")}
                        className="text-brandBlue focus:ring-brandBlue"
                      />
                      <div>
                        <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
                        <p className="text-sm text-gray-600">Thanh toán bằng tiền mặt khi nhận hàng</p>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        value="BANK_TRANSFER"
                        checked={paymentMethod === "BANK_TRANSFER"}
                        onChange={(e) => setPaymentMethod(e.target.value as "BANK_TRANSFER")}
                        className="text-brandBlue focus:ring-brandBlue"
                      />
                      <div>
                        <span className="font-medium">Chuyển khoản ngân hàng</span>
                        <p className="text-sm text-gray-600">Chuyển khoản qua tài khoản ngân hàng</p>
                      </div>
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                    Đặt hàng thành công! Đang chuyển hướng...
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full bg-brandBlue text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang xử lý...
                    </>
                  ) : success ? (
                    "Đặt hàng thành công!"
                  ) : (
                    "Đặt hàng"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-card p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Tóm tắt đơn hàng
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-medium">{formatCurrency(shippingFee)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                  <span className="text-lg font-bold text-brandBlue">{formatCurrency(totalPrice)}</span>
                </div>
              </div>
              
              <Link 
                href="/cart" 
                className="block w-full text-center text-brandBlue py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Quay lại giỏ hàng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

