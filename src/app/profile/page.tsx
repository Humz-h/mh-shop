"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { User, Mail, Calendar, Phone, Shield } from "@/components/UI/icons";

export default function ProfilePage() {
  const { customer, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-2 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const formatDate = (dateString: string | null | undefined) => {
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
    <>
      <Breadcrumb title={"Tài khoản của tôi"} pages={["tài khoản"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-1 p-6">
                <div className="text-center">
                  <div className="mx-auto h-24 w-24 bg-blue/10 rounded-full flex items-center justify-center mb-4">
                    <User className="h-12 w-12 text-blue" />
                  </div>
                  <h2 className="text-xl font-semibold text-dark mb-1">
                    {customer?.fullName || customer?.username || "Chưa cập nhật"}
                  </h2>
                  <p className="text-dark-4 mb-4">{customer?.email}</p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue/10 text-blue">
                    <Shield className="h-4 w-4 mr-1" />
                    {getRoleDisplay(customer?.role)}
                  </div>
                </div>
              </div>
            </div>

            {/* Details Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-1">
                <div className="px-6 py-4 border-b border-gray-3">
                  <h3 className="text-lg font-medium text-dark">Chi tiết tài khoản</h3>
                </div>
                <div className="p-6">
                  <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Username */}
                    <div>
                      <dt className="text-sm font-medium text-dark-4 flex items-center mb-2">
                        <User className="h-4 w-4 mr-2" />
                        Tên đăng nhập
                      </dt>
                      <dd className="text-sm text-dark bg-gray-1 px-4 py-3 rounded-lg">
                        {customer?.username || "Chưa cập nhật"}
                      </dd>
                    </div>

                    {/* Email */}
                    <div>
                      <dt className="text-sm font-medium text-dark-4 flex items-center mb-2">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </dt>
                      <dd className="text-sm text-dark bg-gray-1 px-4 py-3 rounded-lg">
                        {customer?.email || "Chưa cập nhật"}
                      </dd>
                    </div>

                    {/* Full Name */}
                    <div>
                      <dt className="text-sm font-medium text-dark-4 flex items-center mb-2">
                        <User className="h-4 w-4 mr-2" />
                        Họ và tên
                      </dt>
                      <dd className="text-sm text-dark bg-gray-1 px-4 py-3 rounded-lg">
                        {customer?.fullName || "Chưa cập nhật"}
                      </dd>
                    </div>

                    {/* Phone */}
                    <div>
                      <dt className="text-sm font-medium text-dark-4 flex items-center mb-2">
                        <Phone className="h-4 w-4 mr-2" />
                        Số điện thoại
                      </dt>
                      <dd className="text-sm text-dark bg-gray-1 px-4 py-3 rounded-lg">
                        {customer?.phone || "Chưa cập nhật"}
                      </dd>
                    </div>

                    {/* Role */}
                    <div>
                      <dt className="text-sm font-medium text-dark-4 flex items-center mb-2">
                        <Shield className="h-4 w-4 mr-2" />
                        Vai trò
                      </dt>
                      <dd className="text-sm text-dark bg-gray-1 px-4 py-3 rounded-lg">
                        {getRoleDisplay(customer?.role)}
                      </dd>
                    </div>

                    {/* ID */}
                    <div>
                      <dt className="text-sm font-medium text-dark-4 mb-2">
                        ID tài khoản
                      </dt>
                      <dd className="text-sm text-dark bg-gray-1 px-4 py-3 rounded-lg">
                        #{customer?.id || "N/A"}
                      </dd>
                    </div>

                    {/* Created At */}
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-dark-4 flex items-center mb-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        Ngày tạo tài khoản
                      </dt>
                      <dd className="text-sm text-dark bg-gray-1 px-4 py-3 rounded-lg">
                        {formatDate(customer?.createdAt)}
                      </dd>
                    </div>

                    {/* Updated At */}
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-dark-4 flex items-center mb-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        Cập nhật lần cuối
                      </dt>
                      <dd className="text-sm text-dark bg-gray-1 px-4 py-3 rounded-lg">
                        {formatDate(customer?.updatedAt)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 bg-white rounded-xl shadow-1 p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 bg-dark text-white px-4 py-3 rounded-lg hover:bg-blue transition-colors font-medium">
                    Chỉnh sửa thông tin
                  </button>
                  <button className="flex-1 bg-gray-3 text-dark px-4 py-3 rounded-lg hover:bg-gray-4 transition-colors font-medium">
                    Đổi mật khẩu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


