import { apiFetch } from "@/lib/api";

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  if (!token) return {};
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export interface FavoriteProduct {
  id: number;
  productId: number;
  customerId: number;
  product?: {
    id: number;
    name: string;
    originalPrice: number;
    salePrice: number | null;
    imageUrl?: string;
    productCode?: string;
    [key: string]: unknown;
  };
}

export async function getFavorites(customerId: number): Promise<FavoriteProduct[]> {
  const data = await apiFetch<FavoriteProduct[] | { items: FavoriteProduct[] }>(
    `/api/Favorites/${customerId}`,
    { headers: getAuthHeaders() }
  );
  const items = Array.isArray(data) ? data : (data?.items ?? []);
  return items;
}

export async function addFavorite(customerId: number, productId: number): Promise<FavoriteProduct> {
  return apiFetch<FavoriteProduct>("/api/Favorites", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ customerId, productId }),
  });
}

export async function removeFavorite(
  customerId: number,
  productId: number
): Promise<void> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const url = `${API_URL}/api/Favorites/${customerId}/${productId}`;
  const headers = getAuthHeaders();
  const res = await fetch(url, {
    method: "DELETE",
    headers: Object.keys(headers).length > 0 ? headers : { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const text = await res.text();
    let message = `Request failed: ${res.status}`;
    try {
      const data = JSON.parse(text);
      message = data.message || data.error || message;
    } catch {
      if (text) message = text;
    }
    throw new Error(message);
  }
}

export async function checkFavorite(
  customerId: number,
  productId: number
): Promise<{ isFavorite: boolean }> {
  try {
    const res = await apiFetch<{ isFavorite?: boolean; data?: { isFavorite?: boolean } }>(
      `/api/Favorites/check/${customerId}/${productId}`,
      { headers: getAuthHeaders() }
    );
    const isFavorite = res?.isFavorite ?? res?.data?.isFavorite ?? false;
    return { isFavorite: !!isFavorite };
  } catch {
    return { isFavorite: false };
  }
}
