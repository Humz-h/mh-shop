"use client";

import { useState, useEffect } from "react";
import type { Customer } from "@/types";
import { apiFetch } from "@/lib/api";

async function getCurrentUser(token: string): Promise<Customer> {
  return apiFetch<Customer>("/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function useAuth() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("token");
    const savedCustomer = localStorage.getItem("customer");
    
    if (token && savedCustomer) {
      try {
        // Try to parse saved customer data
        const customerData = JSON.parse(savedCustomer);
        setCustomer(customerData);
      } catch {
        // If parsing fails, try to fetch from API
        try {
          const customerData = await getCurrentUser(token);
          setCustomer(customerData);
          localStorage.setItem("customer", JSON.stringify(customerData));
        } catch {
          // If API also fails, clear everything
          localStorage.removeItem("token");
          localStorage.removeItem("customer");
          setCustomer(null);
        }
      }
    } else if (token && !savedCustomer) {
      // Token exists but no saved customer data, try to fetch from API
      try {
        const customerData = await getCurrentUser(token);
        setCustomer(customerData);
        localStorage.setItem("customer", JSON.stringify(customerData));
      } catch {
        // If API fails, clear token
        localStorage.removeItem("token");
        setCustomer(null);
      }
    } else {
      // No token, clear customer data
      setCustomer(null);
    }
    setIsLoading(false);
  };

  const login = (customerData: Customer) => {
    // Store token
    if (customerData.token) {
      localStorage.setItem("token", customerData.token);
    }
    
    // Store customer data in localStorage
    localStorage.setItem("customer", JSON.stringify(customerData));
    
    // Set customer data in state
    setCustomer(customerData);
  };

  const loginWithResponse = (customer: Customer) => {
    // Store token first
    if (customer.token) {
      localStorage.setItem("token", customer.token);
    }
    
    // Prepare customer data
    const customerData = {
      id: customer.id,
      username: customer.username,
      email: customer.email,
      role: customer.role || "user",
      createdAt: customer.createdAt,
      fullName: customer.fullName,
      phone: customer.phone,
      updatedAt: customer.updatedAt
    };
    
    // Store customer data in localStorage
    localStorage.setItem("customer", JSON.stringify(customerData));
    
    // Set customer data in state
    setCustomer(customerData);
  };

  const logout = () => {
    // Show confirmation dialog
    const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (!confirmed) return false;

    // Clear customer data
    localStorage.removeItem("token");
    localStorage.removeItem("customer");
    setCustomer(null);
    
    // Show success message
    alert("Đăng xuất thành công!");
    
    // Redirect to home page
    window.location.href = "/";
    return true;
  };

  const isAuthenticated = !!customer;

  return {
    customer,
    isLoading,
    isAuthenticated,
    login,
    loginWithResponse,
    logout,
    checkAuthStatus
  };
}