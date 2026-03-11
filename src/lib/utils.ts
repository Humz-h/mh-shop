export function formatCurrency(value: number | null | undefined, currency: string = "VND") {
  const numericValue = typeof value === 'number' && !isNaN(value) && value !== null && value !== undefined ? value : 0;
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency }).format(numericValue);
}

const DEFAULT_PRODUCT_IMAGE = "/images/products/default.svg";

export function getImageUrl(imageUrl?: string): string {
  if (!imageUrl) return DEFAULT_PRODUCT_IMAGE;

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // Path local trong public folder - không thêm API_URL
  if (imageUrl.startsWith("/images/") || imageUrl.startsWith("/placeholder")) {
    return imageUrl;
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  return `${API_URL}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
}

export function getDisplayPrice(price: number, salePrice?: number | null): number {
  if (salePrice !== undefined && salePrice !== null && typeof salePrice === 'number' && !isNaN(salePrice)) {
    return salePrice;
  }
  return typeof price === 'number' && !isNaN(price) ? price : 0;
} 