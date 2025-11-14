import { Product } from "@/types/product";
import { fetchProducts } from "@/services/product";

let cachedProducts: Product[] | null = null;
let fetchPromise: Promise<Product[]> | null = null;

export async function getShopData(page: number = 1, pageSize: number = 100): Promise<Product[]> {
  if (cachedProducts) {
    return cachedProducts;
  }

  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = fetchProducts(page, pageSize)
    .then((products) => {
      cachedProducts = products;
      fetchPromise = null;
      return products;
    })
    .catch((error) => {
      fetchPromise = null;
      throw error;
    });

  return fetchPromise;
}

const shopData: Product[] = [];

export default shopData;
