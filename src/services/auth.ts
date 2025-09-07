import { apiFetch } from "@/lib/api";
import type { User } from "@/types";

export async function login(email: string, password: string): Promise<User> {
  return apiFetch<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(name: string, email: string, password: string): Promise<User> {
  return apiFetch<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
} 