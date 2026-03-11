import { apiFetch } from "@/lib/api";
import type { Banner } from "@/types/banner";

export async function fetchBanners(position?: string): Promise<Banner[]> {
  try {
    const url = position 
      ? `/api/Banners?position=${encodeURIComponent(position)}`
      : "/api/Banners";
    
    const banners = await apiFetch<Banner[]>(url);
    
    const now = new Date();
    
    return banners
      .filter((banner) => {
        if (!banner.isActive) return false;
        
        if (banner.startDate) {
          const startDate = new Date(banner.startDate);
          if (startDate > now) return false;
        }
        
        if (banner.endDate) {
          const endDate = new Date(banner.endDate);
          if (endDate < now) return false;
        }
        
        return true;
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        return [];
      }
      throw error;
    }
    throw new Error('Không thể tải banner');
  }
}

export async function fetchBannerById(id: number): Promise<Banner | null> {
  try {
    const banner = await apiFetch<Banner>(`/api/Banners/${id}`);
    return banner;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        return null;
      }
      throw error;
    }
    throw new Error('Không thể tải banner');
  }
}


