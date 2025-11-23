"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/app/auth/services/auth";
import { useAuth } from "@/hooks/useAuth";
import type { Customer } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithResponse, isAuthenticated, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setToken("");
    
    try {
      const result = await login({ email: formData.email, password: formData.password });
      
      if (!result || !result.success || !result.data || !result.data.token || !result.data.user) {
        setError(result?.message || "Đăng nhập không thành công. Vui lòng thử lại.");
        setIsLoading(false);
        return;
      }

      const { token, user } = result.data;

      // Lưu token trước
      localStorage.setItem("token", token);

      // Map user data từ API response sang Customer format
      // API trả về role là "customer", cần map sang "user"
      const customerData: Customer = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: (user.role === "admin" || user.role === "Admin") ? "admin" : "user",
        createdAt: user.createdAt,
        fullName: user.fullName || null,
        token: token
      };
      
      // Lưu customer data và cập nhật state
      loginWithResponse(customerData);
      setToken(token);
      setError("");
      
      // Redirect sau khi delay nhỏ để đảm bảo state được cập nhật
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    } catch (err: unknown) {
      setIsLoading(false);
      if (err instanceof Error) {
        if (err.message.includes("401") || err.message.includes("Unauthorized")) {
          setError("Email hoặc mật khẩu không đúng");
        } else if (err.message.includes("404") || err.message.includes("Not Found")) {
          setError("Không thể kết nối đến server. Vui lòng thử lại sau.");
        } else if (err.message.includes("500") || err.message.includes("Internal Server Error")) {
          setError("Lỗi server. Vui lòng thử lại sau.");
        } else if (err.message.includes("timeout")) {
          setError("Request timeout - server không phản hồi");
        } else if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
          setError("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.");
        } else {
          setError(err.message || "Đăng nhập không thành công. Vui lòng thử lại.");
        }
      } else {
        setError("Đăng nhập không thành công. Vui lòng thử lại.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Redirect if already authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brandBlue"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-card p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Đăng nhập</h1>
          <p className="text-gray-600 mt-2">Chào mừng bạn quay trở lại!</p>
          
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandBlue focus:border-transparent"
              placeholder="Nhập email của bạn"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandBlue focus:border-transparent"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-brandBlue focus:ring-brandBlue" />
              <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
            </label>
            <Link href="/auth/forgot-password" className="text-sm text-brandBlue hover:underline">
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brandBlue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </button>
          

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {token && <p className="text-green-600 text-sm">Đăng nhập thành công ✅</p>}
        </form>

        <div className="mt-6">
          <Link
            href="/signup"
            className="w-full block text-center bg-white border-2 border-brandBlue text-brandBlue py-2 px-4 rounded-md hover:bg-blue-50 transition-colors font-medium"
          >
            Đăng ký tài khoản
          </Link>
        </div>

        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Chưa có tài khoản?{" "}
            <Link href="/signup" className="text-brandBlue hover:underline font-medium">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
