export type ProductVariant = {
  id: number;
  price: number;
  name?: string;
  variantName?: string;
  attributes?: string;
};

export type Product = {
  title: string;
  name?: string;
  reviews: number;
  price: number;
  discountedPrice: number;
  id: number;
  salePrice?: number | null;
  originalPrice?: number;
  discountPercent?: number;
  productGroup?: string;
  productCode?: string;
  stock?: number;
  description?: string;
  productDetails?: Array<{ id?: number; label: string; value: string; brand?: string; origin?: string; warranty?: number; specifications?: string; features?: string; additionalInfo?: string; [key: string]: unknown }>;
  productVariants?: ProductVariant[];
  imageUrl?: string;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};
