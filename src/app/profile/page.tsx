"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User, Mail, Calendar, Phone, Shield } from "@/components/UI/icons";

export default function ProfilePage() {
  const { customer, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Chưa cập nhật";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "Chưa cập nhật";
    }
  };

  const getRoleDisplay = (role: string | undefined) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "user":
        return "Khách hàng";
      default:
        return "Khách hàng";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Thông tin tài khoản</h1>
            <p className="text-gray-600 mt-1">Xem và quản lý thông tin cá nhân của bạn</p>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="text-center">
                <div className="mx-auto h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {customer?.username || "Chưa cập nhật"}
                </h2>
                <p className="text-gray-600 mb-4">{customer?.email}</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <Shield className="h-4 w-4 mr-1" />
                  {getRoleDisplay(customer?.role)}
                </div>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Chi tiết tài khoản</h3>
              </div>
              <div className="p-6">
                <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Username */}
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center mb-2">
                      <User className="h-4 w-4 mr-2" />
                      Tên đăng nhập
                    </dt>
                    <dd className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {customer?.username || "Chưa cập nhật"}
                    </dd>
                  </div>

                  {/* Email */}
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center mb-2">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </dt>
                    <dd className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {customer?.email || "Chưa cập nhật"}
                    </dd>
                  </div>

                  {/* Full Name */}
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center mb-2">
                      <User className="h-4 w-4 mr-2" />
                      Họ và tên
                    </dt>
                    <dd className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {customer?.fullName || "Chưa cập nhật"}
                    </dd>
                  </div>

                  {/* Phone */}
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center mb-2">
                      <Phone className="h-4 w-4 mr-2" />
                      Số điện thoại
                    </dt>
                    <dd className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {customer?.phone || "Chưa cập nhật"}
                    </dd>
                  </div>

                  {/* Role */}
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center mb-2">
                      <Shield className="h-4 w-4 mr-2" />
                      Vai trò
                    </dt>
                    <dd className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {getRoleDisplay(customer?.role)}
                    </dd>
                  </div>

                  {/* ID */}
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-2">
                      ID tài khoản
                    </dt>
                    <dd className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      #{customer?.id || "N/A"}
                    </dd>
                  </div>

                  {/* Created At */}
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500 flex items-center mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      Ngày tạo tài khoản
                    </dt>
                    <dd className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {formatDate(customer?.createdAt)}
                    </dd>
                  </div>

                  {/* Updated At */}
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500 flex items-center mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      Cập nhật lần cuối
                    </dt>
                    <dd className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {formatDate(customer?.updatedAt)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 bg-white shadow-sm rounded-lg p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium">
                  Chỉnh sửa thông tin
                </button>
                <button className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors font-medium">
                  Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


