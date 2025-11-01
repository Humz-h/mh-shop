import { apiFetch } from "@/lib/api";
import type { Customer } from "@/types";

export async function login(email: string, password: string): Promise<Customer> {
  return apiFetch<Customer>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(name: string, email: string, password: string): Promise<Customer> {
  return apiFetch<Customer>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
} 