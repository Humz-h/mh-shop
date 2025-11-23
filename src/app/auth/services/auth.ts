export interface RegisterRequest {
  username?: string;
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginUserData {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: LoginUserData;
  };
}

export interface ApiResponse {
  message: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function login(request: LoginRequest): Promise<LoginResponse> {
  try {
    // Thử endpoint với chữ A hoa trước (theo API thực tế)
    let res: Response;
    try {
      res = await fetch(`${API_BASE}/api/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
    } catch {
      // Fallback về chữ a thường nếu không được
      res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
    }

    const text = await res.text();

    if (!res.ok) {
      let errorMessage = `${res.status} ${res.statusText}`;
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = text || errorMessage;
      }
      throw new Error(`${res.status}: ${errorMessage}`);
    }

    if (!text) {
      throw new Error("Empty response from server");
    }

    try {
      const response = JSON.parse(text) as LoginResponse;
      
      // Kiểm tra cấu trúc response
      if (!response.success) {
        throw new Error(response.message || "Đăng nhập không thành công");
      }
      
      if (!response.data || !response.data.token) {
        throw new Error("Token không có trong response");
      }
      
      if (!response.data.user) {
        throw new Error("Thông tin user không có trong response");
      }
      
      return response;
    } catch (parseError) {
      if (parseError instanceof Error) {
        throw parseError;
      }
      throw new Error("Invalid response format from server");
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      }
      throw error;
    }
    throw new Error('Có lỗi xảy ra khi đăng nhập');
  }
}

export async function registerUser(data: RegisterRequest): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const text = await res.text(); // chỉ đọc body 1 lần

  if (!res.ok) {
    let errorMessage = `${res.status} ${res.statusText}`;
    try {
      const errorData = JSON.parse(text);
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // Nếu text không phải JSON, thử parse nếu có JSON trong text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const errorData = JSON.parse(jsonMatch[0]);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = text || errorMessage;
        }
      } else {
        errorMessage = text || errorMessage;
      }
    }
    throw new Error(errorMessage);
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}
  