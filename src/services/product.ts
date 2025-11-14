import { apiFetch } from "@/lib/api";
import type { Product } from "@/types";

interface ApiProduct {
  id: number;
  name: string;
  productCode?: string;
  originalPrice: number;
  productGroup?: string;
  discountPercent?: number;
  salePrice: number | null;
  stock?: number;
  imageUrl?: string;
  description?: string;
  productDetails?: Array<{ 
    id?: number; 
    productId?: number;
    label?: string; 
    value?: string; 
    brand?: string; 
    origin?: string; 
    warranty?: number | string; 
    specifications?: string; 
    features?: string; 
    additionalInfo?: string; 
    [key: string]: unknown 
  }>;
  productVariants?: Array<{ 
    id: number; 
    productId?: number;
    price: number; 
    name?: string; 
    variantName?: string; 
    attributes?: string;
    sku?: string;
    [key: string]: unknown;
  }>;
  status?: boolean;
  createdAt?: string;
  inventories?: unknown;
}

export async function fetchProducts(page: number = 1, pageSize: number = 100): Promise<Product[]> {
  try {
    const apiProducts = await apiFetch<ApiProduct[]>(`/api/Products?page=${page}&pageSize=${pageSize}`);
    
    return apiProducts.map((apiProduct) => ({
      id: apiProduct.id,
      title: apiProduct.name,
      name: apiProduct.name,
      reviews: 0,
      price: apiProduct.originalPrice,
      discountedPrice: apiProduct.salePrice || apiProduct.originalPrice,
      salePrice: apiProduct.salePrice,
      originalPrice: apiProduct.originalPrice,
      discountPercent: apiProduct.discountPercent || 0,
      productGroup: apiProduct.productGroup,
      productCode: apiProduct.productCode,
      stock: apiProduct.stock,
      description: apiProduct.description,
      productDetails: apiProduct.productDetails,
      productVariants: apiProduct.productVariants,
      imageUrl: apiProduct.imageUrl,
      imgs: apiProduct.imageUrl ? {
        thumbnails: [apiProduct.imageUrl],
        previews: [apiProduct.imageUrl],
      } : undefined,
    })) as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function fetchProductById(id: number): Promise<Product> {
  try {
    const apiProduct = await apiFetch<ApiProduct>(`/api/Products/${id}`);
    
    // Xử lý warranty: có thể là string hoặc number
    const processedProductDetails = apiProduct.productDetails?.map((detail) => ({
      ...detail,
      warranty: typeof detail.warranty === 'string' 
        ? parseInt(detail.warranty, 10) || undefined
        : detail.warranty,
    }));

    // Đảm bảo imgs luôn được tạo nếu có imageUrl
    const imageUrl = apiProduct.imageUrl;
    const imgs = imageUrl ? {
      thumbnails: [imageUrl],
      previews: [imageUrl],
    } : undefined;

    return {
      id: apiProduct.id,
      title: apiProduct.name,
      name: apiProduct.name,
      reviews: 0,
      price: apiProduct.originalPrice,
      discountedPrice: apiProduct.salePrice || apiProduct.originalPrice,
      salePrice: apiProduct.salePrice,
      originalPrice: apiProduct.originalPrice,
      discountPercent: apiProduct.discountPercent || 0,
      productGroup: apiProduct.productGroup,
      productCode: apiProduct.productCode,
      stock: apiProduct.stock,
      description: apiProduct.description,
      productDetails: processedProductDetails,
      productVariants: apiProduct.productVariants,
      imageUrl: imageUrl,
      imgs: imgs,
    } as Product;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        throw new Error('Không tìm thấy sản phẩm');
      }
      throw error;
    }
    throw new Error('Không thể tải thông tin sản phẩm');
  }
} 