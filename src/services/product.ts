import { apiFetch } from "@/lib/api";
import type { Product } from "@/types";

export async function fetchProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/products");
}

export async function fetchProductById(id: string): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`);
} 