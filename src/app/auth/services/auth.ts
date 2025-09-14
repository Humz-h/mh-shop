import { apiFetch } from "@/lib/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  try {
    return await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(request),
    });
  } catch (err: any) {
    // If server uses /api prefix, try that automatically when first endpoint 404s
    if (/404/.test(String(err.message))) {
      return apiFetch<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(request),
      });
    }
    // Normalize error for UI
    throw new Error("Đăng nhập không thành công");
  }
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  token: string;
  username: string;
  role: string;
}

export async function register(request: RegisterRequest): Promise<RegisterResponse> {
  try {
    return await apiFetch<RegisterResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(request),
    });
  } catch (err: any) {
    if (/404/.test(String(err.message))) {
      return apiFetch<RegisterResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(request),
      });
    }
    throw err;
  }
}
  