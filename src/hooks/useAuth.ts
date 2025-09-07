import { useState, useCallback } from "react";
import type { User } from "@/types/user";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      // TODO: integrate with services/auth
      setUser({ id: "temp", name: "Demo User", email });
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
  }, []);

  return { user, loading, login, logout };
} 