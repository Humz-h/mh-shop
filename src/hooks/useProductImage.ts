"use client";

import { useState, useEffect } from "react";
import { fetchProductImage } from "@/services/product";

/**
 * Hook lấy URL ảnh sản phẩm. Nếu đã có initialUrl thì dùng luôn,
 * không thì fetch từ API theo productId.
 */
export function useProductImage(
  productId: number,
  initialUrl?: string
): string | undefined {
  const [fetchedUrl, setFetchedUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (initialUrl) return;
    let cancelled = false;
    fetchProductImage(productId).then((url) => {
      if (!cancelled && url) setFetchedUrl(url);
    });
    return () => { cancelled = true; };
  }, [productId, initialUrl]);

  return initialUrl || fetchedUrl;
}
