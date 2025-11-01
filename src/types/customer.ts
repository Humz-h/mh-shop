export interface Customer {
  id: number;
  username: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  fullName?: string | null;
  phone?: string | null;
  updatedAt?: string | null;
  token?: string;
}
