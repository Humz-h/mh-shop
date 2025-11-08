export interface ProductDetail {
  id: number;
  productId: number;
  brand?: string;
  origin?: string;
  warranty?: string;
  specifications?: string;
  features?: string;
  additionalInfo?: string;
  createdAt?: string;
  updatedAt?: string;
  product?: Product | null;
}

export interface ProductVariant {
  id: number;
  productId: number;
  variantName?: string;
  attributes?: string;
  price?: number;
  sku?: string;
  product?: Product | null;
}

export interface Inventory {
  id: number;
  productId: number;
  quantity?: number;
  location?: string;
  [key: string]: unknown;
}

export interface Product {
  id: number;
  name: string;
  productCode?: string;
  originalPrice?: number;
  productGroup?: string;
  discountPercent?: number;
  description?: string;
  price?: number;
  salePrice?: number;
  imageUrl?: string;
  stock?: number;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
  productDetails?: ProductDetail[];
  productVariants?: ProductVariant[];
  inventories?: Inventory[];
} 