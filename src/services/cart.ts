import { apiFetch } from "@/lib/api";
import type { CartItem } from "@/types";

export async function fetchCart(): Promise<CartItem[]> {
  return apiFetch<CartItem[]>("/cart");
}

export async function addToCart(productId: string, quantity: number) {
  return apiFetch("/cart", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function removeFromCart(productId: string) {
  return apiFetch(`/cart/${productId}`, { method: "DELETE" });
} 