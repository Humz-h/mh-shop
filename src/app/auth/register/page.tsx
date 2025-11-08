"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/auth/services/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Mật khẩu phải có ít nhất 6 ký tự");
      setIsLoading(false);
      return;
    }

    try {
      const result = await registerUser({
        username: formData.email.split("@")[0],
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      });
      setMessage(result.message);
      
      // Redirect to login page after successful registration
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
      
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Đã xảy ra lỗi khi đăng ký");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-card p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Đăng ký tài khoản</h1>
          <p className="text-gray-600 mt-2">Tạo tài khoản mới để mua sắm</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandBlue focus:border-transparent"
              placeholder="Nhập họ và tên của bạn"
              required
            />
          </div>

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
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandBlue focus:border-transparent"
              placeholder="Nhập lại mật khẩu"
              required
            />
          </div>

          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="terms" 
              className="rounded border-gray-300 text-brandBlue focus:ring-brandBlue" 
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              Tôi đồng ý với{" "}
              <Link href="/terms" className="text-brandBlue hover:underline">
                Điều khoản sử dụng
              </Link>{" "}
              và{" "}
              <Link href="/privacy" className="text-brandBlue hover:underline">
                Chính sách bảo mật
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brandBlue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang đăng ký..." : "Đăng ký tài khoản"}
          </button>

          {message && (
            <p className={`text-sm text-center ${
              message.includes("thành công") || message.includes("success") 
                ? "text-green-600" 
                : "text-red-500"
            }`}>
              {message}
            </p>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Đã có tài khoản?{" "}
            <Link href="/auth/login" className="text-brandBlue hover:underline font-medium">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 