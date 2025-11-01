export function formatCurrency(value: number | null | undefined, currency: string = "VND") {
  const numericValue = typeof value === 'number' && !isNaN(value) && value !== null && value !== undefined ? value : 0;
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency }).format(numericValue);
}

export function getImageUrl(imageUrl?: string): string {
  if (!imageUrl) return "/placeholder.svg";
  
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
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