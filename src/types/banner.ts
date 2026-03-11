export type Banner = {
  id: number;
  title: string;
  imageUrl: string;
  position: string;
  redirectType: "PRODUCT" | "CATEGORY" | "URL";
  redirectValue?: string | null;
  displayOrder: number;
  isActive: boolean;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};


