"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Customer } from "@/types";
import { updateProfile as updateProfileApi, uploadAvatar as uploadAvatarApi, changePassword as changePasswordApi, getCurrentUser, getProfile, type UpdateProfileData, type ChangePasswordData } from "@/services/auth";

interface AuthContextType {
  customer: Customer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (customerData: Customer) => void;
  loginWithResponse: (customer: Customer) => void;
  logout: () => boolean;
  checkAuthStatus: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<{ success: boolean; error?: string }>;
  uploadAvatar: (file: File) => Promise<{ success: boolean; error?: string }>;
  changePassword: (data: ChangePasswordData) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("token");
    const savedCustomer = localStorage.getItem("customer");

    if (token) {
      try {
        const customerData = await getCurrentUser(token);
        const fullData = { ...customerData, token };
        setCustomer(fullData);
        localStorage.setItem("customer", JSON.stringify(fullData));
      } catch {
        // Thử GET /api/Users/{id} — cùng API updateProfile dùng
        if (savedCustomer) {
          try {
            const parsed = JSON.parse(savedCustomer);
            const id = parsed?.id;
            if (id) {
              const fresh = await getProfile(id, token);
              const fullData = { ...fresh, token };
              setCustomer(fullData);
              localStorage.setItem("customer", JSON.stringify(fullData));
            } else {
              setCustomer(parsed);
            }
          } catch {
            try {
              setCustomer(JSON.parse(savedCustomer));
            } catch {
              localStorage.removeItem("token");
              localStorage.removeItem("customer");
              setCustomer(null);
            }
          }
        } else {
          localStorage.removeItem("token");
          setCustomer(null);
        }
      }
    } else {
      setCustomer(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = (customerData: Customer) => {
    if (customerData.token) {
      localStorage.setItem("token", customerData.token);
    }
    localStorage.setItem("customer", JSON.stringify(customerData));
    setCustomer(customerData);
  };

  const loginWithResponse = (customerData: Customer) => {
    if (customerData.token) {
      localStorage.setItem("token", customerData.token);
    }
    const data = {
      id: customerData.id,
      username: customerData.username,
      email: customerData.email,
      role: customerData.role || "user",
      createdAt: customerData.createdAt,
      fullName: customerData.fullName,
      phone: customerData.phone,
      avatarUrl: customerData.avatarUrl,
      updatedAt: customerData.updatedAt,
    };
    localStorage.setItem("customer", JSON.stringify(data));
    setCustomer(data);
  };

  const updateProfile = async (data: UpdateProfileData): Promise<{ success: boolean; error?: string }> => {
    if (!customer?.id) return { success: false, error: "Chưa đăng nhập" };
    try {
      const updated = await updateProfileApi(customer.id, data);
      const customerData = {
        ...customer,
        fullName: updated.fullName ?? customer.fullName,
        phone: updated.phone ?? customer.phone,
        email: updated.email ?? customer.email,
        avatarUrl: updated.avatarUrl ?? customer.avatarUrl,
        updatedAt: updated.updatedAt ?? customer.updatedAt,
      };
      setCustomer(customerData);
      localStorage.setItem("customer", JSON.stringify(customerData));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Chỉnh sửa thất bại",
      };
    }
  };

  const uploadAvatar = async (file: File): Promise<{ success: boolean; error?: string }> => {
    if (!customer?.id) return { success: false, error: "Chưa đăng nhập" };
    if (!file.type.startsWith("image/")) return { success: false, error: "Chỉ chấp nhận file ảnh" };
    if (file.size > 2 * 1024 * 1024) return { success: false, error: "Ảnh tối đa 2MB" };

    try {
      const { avatarUrl } = await uploadAvatarApi(customer.id, file);
      if (avatarUrl) {
        const customerData = { ...customer, avatarUrl };
        setCustomer(customerData);
        localStorage.setItem("customer", JSON.stringify(customerData));
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Không thể tải ảnh lên",
      };
    }
    return { success: false, error: "Không nhận được URL ảnh từ server" };
  };

  const changePassword = async (data: ChangePasswordData): Promise<{ success: boolean; error?: string }> => {
    if (!customer?.id) return { success: false, error: "Chưa đăng nhập" };
    if (!data.currentPassword?.trim()) return { success: false, error: "Vui lòng nhập mật khẩu hiện tại" };
    if (!data.newPassword?.trim()) return { success: false, error: "Vui lòng nhập mật khẩu mới" };
    if (data.newPassword.length < 6) return { success: false, error: "Mật khẩu mới phải có ít nhất 6 ký tự" };
    try {
      await changePasswordApi(customer.id, data);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Đổi mật khẩu thất bại",
      };
    }
  };

  const logout = () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (!confirmed) return false;
    localStorage.removeItem("token");
    localStorage.removeItem("customer");
    setCustomer(null);
    window.location.href = "/";
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        isLoading,
        isAuthenticated: !!customer,
        login,
        loginWithResponse,
        logout,
        checkAuthStatus,
        updateProfile,
        uploadAvatar,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
