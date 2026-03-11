"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Image from "next/image";
import { User, Mail, Calendar, Phone, Shield, Camera } from "@/components/UI/icons";

export default function ProfilePage() {
  const { customer, isAuthenticated, isLoading, updateProfile, uploadAvatar, changePassword } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Element;
      if (showPasswordModal && target && !target.closest(".modal-content")) {
        setShowPasswordModal(false);
      }
    }
    if (showPasswordModal) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPasswordModal]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (customer) {
      setFullName(customer.fullName ?? "");
      setEmail(customer.email ?? "");
      setPhone(customer.phone ?? "");
    }
  }, [customer]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      const result = await updateProfile({ fullName, email, phone });
      if (result.success) {
        setMessage({ type: "success", text: "Chỉnh sửa thông tin thành công!" });
        setIsEditing(false);
      } else {
        setMessage({ type: "error", text: result.error ?? "Chỉnh sửa thất bại" });
      }
    } catch {
      setMessage({ type: "error", text: "Có lỗi xảy ra khi cập nhật." });
    } finally {
      setSaving(false);
    }
  };

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
        minute: "2-digit",
      });
    } catch {
      return "Chưa cập nhật";
    }
  };

  const getAvatarSrc = () => {
    const url = customer?.avatarUrl;
    if (!url) return null;
    if (url.startsWith("data:") || url.startsWith("http")) return url;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    return `${API_URL}${url.startsWith("/") ? url : `/${url}`}`;
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    setMessage(null);
    try {
      const result = await uploadAvatar(file);
      if (result.success) {
        setMessage({ type: "success", text: "Đã cập nhật ảnh đại diện!" });
      } else {
        setMessage({ type: "error", text: result.error ?? "Không thể tải ảnh lên" });
      }
    } catch {
      setMessage({ type: "error", text: "Không thể tải ảnh lên" });
    } finally {
      setUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu mới và xác nhận không khớp" });
      return;
    }
    setChangingPassword(true);
    try {
      const result = await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      if (result.success) {
        setMessage({ type: "success", text: "Đổi mật khẩu thành công!" });
        setShowPasswordModal(false);
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setMessage({ type: "error", text: result.error ?? "Đổi mật khẩu thất bại" });
      }
    } catch {
      setMessage({ type: "error", text: "Đổi mật khẩu thất bại" });
    } finally {
      setChangingPassword(false);
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
      <section className="overflow-hidden py-8 sm:py-10 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-1 p-6">
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <div className="w-full h-full rounded-full overflow-hidden bg-blue/10 flex items-center justify-center shrink-0">
                        {getAvatarSrc() ? (
                          <Image
                            src={getAvatarSrc()!}
                            alt="Avatar"
                            width={96}
                            height={96}
                            className="w-full h-full object-cover object-center"
                            unoptimized
                          />
                        ) : (
                          <User className="h-12 w-12 text-blue" />
                        )}
                      </div>
                      {isEditing && (
                        <>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingAvatar}
                            className="absolute -bottom-0.5 -right-0.5 w-8 h-8 rounded-full bg-white border-2 border-gray-3 flex items-center justify-center shadow-md hover:bg-gray-1 hover:border-blue transition-colors disabled:opacity-70 text-dark"
                            title="Đổi ảnh đại diện"
                          >
                            {uploadingAvatar ? (
                              <span className="w-4 h-4 border-2 border-blue border-t-transparent rounded-full animate-spin block" />
                            ) : (
                              <Camera size={16} className="text-blue" strokeWidth={2} />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-dark mb-1">
                      {fullName || customer?.username || "Chưa cập nhật"}
                    </h2>
                    <p className="text-dark-4 mb-4">{email || "Chưa cập nhật"}</p>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue/10 text-blue mb-4">
                      <Shield className="h-4 w-4 mr-1" />
                      {getRoleDisplay(customer?.role)}
                    </div>
                    {isEditing ? (
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={saving}
                          className="flex-1 px-4 py-3 bg-gray-3 text-dark font-medium rounded-lg border border-gray-3 hover:bg-gray-4 hover:border-gray-4 transition-colors disabled:opacity-70"
                        >
                          {saving ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setFullName(customer?.fullName ?? "");
                            setEmail(customer?.email ?? "");
                            setPhone(customer?.phone ?? "");
                          }}
                          disabled={saving}
                          className="flex-1 px-4 py-3 bg-white text-dark font-medium rounded-lg border border-gray-3 hover:bg-gray-1 transition-colors"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="w-full px-4 py-3 bg-gray-3 text-dark font-medium rounded-lg border border-gray-3 hover:bg-gray-4 hover:border-gray-4 transition-colors flex items-center justify-center gap-2 mx-auto"
                      >
                        Chỉnh sửa thông tin
                      </button>
                    )}
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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* Username - read only */}
                      <div className="rounded-lg border border-gray-3 bg-gray-1/30 p-4 transition-all duration-200 hover:border-blue/40 hover:bg-blue/5 hover:shadow-sm">
                        <label className="text-sm font-medium text-dark-4 flex items-center mb-2">
                          <User className="h-4 w-4 mr-2" />
                          Tên đăng nhập
                        </label>
                        <div className="text-sm text-dark">
                          {customer?.username || "Chưa cập nhật"}
                        </div>
                      </div>

                      {/* Email - editable */}
                      <div className="rounded-lg border border-gray-3 bg-gray-1/30 p-4 transition-all duration-200 hover:border-blue/40 hover:bg-blue/5 hover:shadow-sm focus-within:border-blue focus-within:ring-2 focus-within:ring-blue/20">
                        <label htmlFor="email" className="text-sm font-medium text-dark-4 flex items-center mb-2">
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={!isEditing}
                          readOnly={!isEditing}
                          className={`w-full text-sm text-dark bg-transparent border-none outline-none transition-colors ${
                            isEditing ? "focus:ring-0 cursor-text" : "cursor-not-allowed opacity-90"
                          }`}
                          placeholder="Nhập email"
                        />
                      </div>

                      {/* Full Name - editable */}
                      <div className="rounded-lg border border-gray-3 bg-gray-1/30 p-4 transition-all duration-200 hover:border-blue/40 hover:bg-blue/5 hover:shadow-sm">
                        <label htmlFor="fullName" className="text-sm font-medium text-dark-4 flex items-center mb-2">
                          <User className="h-4 w-4 mr-2" />
                          Họ và tên
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          disabled={!isEditing}
                          readOnly={!isEditing}
                          className={`w-full text-sm text-dark bg-transparent border-none outline-none transition-colors ${
                            isEditing ? "focus:ring-0 cursor-text" : "cursor-not-allowed opacity-90"
                          }`}
                          placeholder="Nhập họ và tên"
                        />
                      </div>

                      {/* Phone - editable */}
                      <div className="rounded-lg border border-gray-3 bg-gray-1/30 p-4 transition-all duration-200 hover:border-blue/40 hover:bg-blue/5 hover:shadow-sm focus-within:border-blue focus-within:ring-2 focus-within:ring-blue/20">
                        <label htmlFor="phone" className="text-sm font-medium text-dark-4 flex items-center mb-2">
                          <Phone className="h-4 w-4 mr-2" />
                          Số điện thoại
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          disabled={!isEditing}
                          readOnly={!isEditing}
                          className={`w-full text-sm text-dark bg-transparent border-none outline-none transition-colors ${
                            isEditing ? "focus:ring-0 cursor-text" : "cursor-not-allowed opacity-90"
                          }`}
                          placeholder="Nhập số điện thoại"
                        />
                      </div>

                      {/* Role - read only */}
                      <div className="rounded-lg border border-gray-3 bg-gray-1/30 p-4 transition-all duration-200 hover:border-blue/40 hover:bg-blue/5 hover:shadow-sm">
                        <label className="text-sm font-medium text-dark-4 flex items-center mb-2">
                          <Shield className="h-4 w-4 mr-2" />
                          Vai trò
                        </label>
                        <div className="text-sm text-dark">
                          {getRoleDisplay(customer?.role)}
                        </div>
                      </div>

                      {/* ID - read only */}
                      <div className="rounded-lg border border-gray-3 bg-gray-1/30 p-4 transition-all duration-200 hover:border-blue/40 hover:bg-blue/5 hover:shadow-sm">
                        <label className="text-sm font-medium text-dark-4 mb-2">ID tài khoản</label>
                        <div className="text-sm text-dark">
                          #{customer?.id || "N/A"}
                        </div>
                      </div>

                      {/* Created At - read only */}
                      <div className="sm:col-span-2 rounded-lg border border-gray-3 bg-gray-1/30 p-4 transition-all duration-200 hover:border-blue/40 hover:bg-blue/5 hover:shadow-sm">
                        <label className="text-sm font-medium text-dark-4 flex items-center mb-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          Ngày tạo tài khoản
                        </label>
                        <div className="text-sm text-dark">
                          {formatDate(customer?.createdAt)}
                        </div>
                      </div>

                      {/* Updated At - read only */}
                      <div className="sm:col-span-2 rounded-lg border border-gray-3 bg-gray-1/30 p-4 transition-all duration-200 hover:border-blue/40 hover:bg-blue/5 hover:shadow-sm">
                        <label className="text-sm font-medium text-dark-4 flex items-center mb-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          Cập nhật lần cuối
                        </label>
                        <div className="text-sm text-dark">
                          {formatDate(customer?.updatedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Toast message - floating, tự ẩn sau 3s */}
                {message && (
                  <div
                    className={`fixed top-6 right-6 z-[9999] px-5 py-3 rounded-lg text-sm font-medium shadow-lg animate-in fade-in slide-in-from-top-2 duration-300 ${
                      message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                    role="alert"
                  >
                    {message.text}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 bg-white rounded-xl shadow-1 p-6">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full bg-gray-3 text-dark px-4 py-3 rounded-lg border border-gray-3 hover:bg-gray-4 hover:border-gray-4 transition-colors font-medium"
                  >
                    Đổi mật khẩu
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Modal đổi mật khẩu - render ngoài form để tránh nested form */}
          {showPasswordModal && (
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-dark/50 p-4"
              onClick={(e) => e.target === e.currentTarget && setShowPasswordModal(false)}
            >
              <div className="w-full max-w-md rounded-lg bg-white border border-gray-3 p-6 modal-content">
                <h3 className="text-lg font-semibold text-dark mb-4">Đổi mật khẩu</h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-dark-4 mb-1.5">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      id="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                      className="w-full rounded-md border border-gray-3 bg-white py-2.5 px-4 text-dark outline-none focus:border-blue focus:ring-0"
                      placeholder="Nhập mật khẩu hiện tại"
                      required
                      autoComplete="current-password"
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-dark-4 mb-1.5">
                      Mật khẩu mới
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                      className="w-full rounded-md border border-gray-3 bg-white py-2.5 px-4 text-dark outline-none focus:border-blue focus:ring-0"
                      placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-4 mb-1.5">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                      className="w-full rounded-md border border-gray-3 bg-white py-2.5 px-4 text-dark outline-none focus:border-blue focus:ring-0"
                      placeholder="Nhập lại mật khẩu mới"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordModal(false);
                        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                      }}
                      className="flex-1 py-2.5 px-4 rounded-md border border-gray-3 bg-white text-dark font-medium hover:bg-gray-1 shadow-none"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="flex-1 py-2.5 px-4 rounded-md bg-brandBlue text-white font-medium hover:opacity-90 disabled:opacity-70 shadow-none"
                    >
                      {changingPassword ? "Đang xử lý..." : "Đổi mật khẩu"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
