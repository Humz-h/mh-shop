import { useCallback, useMemo, useState } from "react";
import type { CartItem } from "@/types/cart";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const index = prev.findIndex((x) => x.product.id === item.product.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = { ...next[index], quantity: next[index].quantity + item.quantity };
        return next;
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((x) => x.product.id !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return { items, addItem, removeItem, clear, totalQuantity };
} 