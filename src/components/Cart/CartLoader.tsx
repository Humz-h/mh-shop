"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/store";
import { loadCartFromStorage } from "@/redux/features/cart-slice";
import { useAuth } from "@/hooks/useAuth";

/**
 * Component để tự động load cart từ localStorage khi user đăng nhập hoặc customer thay đổi
 */
export function CartLoader() {
  const dispatch = useAppDispatch();
  const { customer, isAuthenticated } = useAuth();

  useEffect(() => {
    // Load cart từ localStorage mỗi khi customer thay đổi (đăng nhập/đăng xuất)
    dispatch(loadCartFromStorage());
  }, [dispatch, customer?.id, customer?.email, isAuthenticated]);

  return null;
}

