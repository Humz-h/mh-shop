import { apiFetch } from "@/lib/api";
import type { Customer } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/** Lấy toàn bộ thông tin user từ BE (avatarUrl, phone, fullName, v.v.) */
export async function getCurrentUser(token: string): Promise<Customer> {
  let data: unknown;
  try {
    data = await apiFetch<Customer | { data: Customer }>("/api/auth/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    try {
      data = await apiFetch<Customer | { data: Customer }>("/api/Auth/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      throw new Error("Auth/me not available");
    }
  }
  if (!data || typeof data !== "object") throw new Error("Invalid response");
  return (data && "data" in data ? data.data : data) as Customer;
}

/** Lấy profile đầy đủ qua GET /api/Users/{id} (cùng API mà updateProfile dùng) */
export async function getProfile(userId: number, token: string): Promise<Customer> {
  const res = await fetch(`${API_URL}/api/Users/${userId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Get profile failed");
  const json = await res.json();
  const data = json?.data ?? json;
  return data as Customer;
}

export async function login(email: string, password: string): Promise<Customer> {
  return apiFetch<Customer>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(name: string, email: string, password: string): Promise<Customer> {
  return apiFetch<Customer>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export type UpdateProfileData = {
  fullName?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
};

export async function uploadAvatar(userId: number, file: File): Promise<{ avatarUrl?: string }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) {
    throw new Error("Bạn cần đăng nhập để cập nhật ảnh.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/Users/${userId}/avatar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
    // Không set Content-Type — để browser tự set multipart/form-data với boundary
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Upload thất bại: ${res.status}`);
  }

  const data = await res.json();
  // Hỗ trợ nhiều format response từ BE: { avatarUrl }, { data: { avatarUrl } }, { data: "/path" }, v.v.
  const url =
    data?.avatarUrl ??
    data?.imageUrl ??
    data?.data?.avatarUrl ??
    data?.data?.imageUrl ??
    (typeof data?.data === "string" ? data.data : null);
  return { avatarUrl: url };
}

export async function updateProfile(userId: number, data: UpdateProfileData): Promise<Customer> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) {
    throw new Error("Bạn cần đăng nhập để cập nhật thông tin.");
  }

  const res = await fetch(`${API_URL}/api/Users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }

  const response = await res.json();
  return response.data;
}

export type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
};

/** Đổi mật khẩu - POST /api/Auth/change-password hoặc /api/Users/change-password */
export async function changePassword(userId: number, data: ChangePasswordData): Promise<void> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) throw new Error("Bạn cần đăng nhập.");

  const body = { currentPassword: data.currentPassword, newPassword: data.newPassword };

  const tryFetch = (url: string) =>
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

  let res = await tryFetch(`${API_URL}/api/Auth/change-password`);
  if (res.status === 404) {
    res = await tryFetch(`${API_URL}/api/Users/${userId}/change-password`);
  }

  if (!res.ok) {
    const text = await res.text();
    let msg = "Đổi mật khẩu thất bại";
    try {
      const json = JSON.parse(text);
      msg = json.message ?? json.error ?? msg;
    } catch {
      msg = text || msg;
    }
    throw new Error(msg);
  }
} 