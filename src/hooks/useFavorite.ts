"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { checkFavorite, addFavorite, removeFavorite } from "@/services/favorite";

export function useFavorite(productId: number) {
  const { customer, isAuthenticated } = useAuth();
  const customerId = customer?.id ?? 0;
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!customerId || !productId) return;
    checkFavorite(customerId, productId)
      .then((res) => setIsFavorite(res?.isFavorite ?? false))
      .catch(() => setIsFavorite(false));
  }, [customerId, productId]);

  const toggle = async (): Promise<boolean> => {
    if (!isAuthenticated) return false;
    if (!customerId) return false;
    setLoading(true);
    try {
      if (isFavorite) {
        await removeFavorite(customerId, productId);
        setIsFavorite(false);
      } else {
        await addFavorite(customerId, productId);
        setIsFavorite(true);
      }
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { isFavorite, toggle, loading };
}
