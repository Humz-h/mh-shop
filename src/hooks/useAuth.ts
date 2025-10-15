"use client";

import { useState, useEffect } from "react";

interface User {
  id?: number;
  name: string;
  email: string;
  role?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    if (token) {
      // Mock user data - in real app, you'd decode JWT or fetch user info
      setUser({
        id: 21,
        name: "admin",
        email: "admin@123gmail.com",
        role: "admin"
      });
    }
    setIsLoading(false);
  };

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("token", "mock-token");
  };

  const loginWithResponse = (response: { token: string; name: string; email: string; role?: string }) => {
    setUser({
      name: response.name,
      email: response.email,
      role: response.role || "user"
    });
    localStorage.setItem("token", response.token);
  };

  const logout = () => {
    // Show confirmation dialog
    const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (!confirmed) return false;

    // Clear user data
    localStorage.removeItem("token");
    setUser(null);
    
    // Show success message
    alert("Đăng xuất thành công!");
    
    // Redirect to home page
    window.location.href = "/";
    return true;
  };

  const isAuthenticated = !!user;

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    loginWithResponse,
    logout,
    checkAuthStatus
  };
}