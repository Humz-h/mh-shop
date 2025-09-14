import { apiFetch } from "@/lib/api";
import type { Product } from "@/types";

export async function fetchProducts(): Promise<Product[]> {
  try {
    return await apiFetch<Product[]>("/api/Products");
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function fetchProductById(id: number): Promise<Product> {
  try {
    return await apiFetch<Product>(`/api/Products/${id}`);
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
} 