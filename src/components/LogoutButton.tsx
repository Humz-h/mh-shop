"use client";

import { LogOut } from "@/components/UI/icons";
import { useAuth } from "@/hooks/useAuth";

interface LogoutButtonProps {
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
  variant?: "default" | "danger" | "ghost";
  onClick?: () => void;
}

export function LogoutButton({ 
  className = "", 
  showIcon = true, 
  showText = true,
  variant = "default",
  onClick
}: LogoutButtonProps) {
  const { logout } = useAuth();

  const handleLogout = () => {
    const success = logout();
    if (success && onClick) {
      onClick();
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "danger":
        return "text-red-600 hover:bg-red-50 hover:text-red-700";
      case "ghost":
        return "text-gray-700 hover:bg-gray-50 hover:text-gray-900";
      default:
        return "text-gray-700 hover:bg-gray-50 hover:text-gray-900";
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${getVariantClasses()} ${className}`}
    >
      {showIcon && <LogOut className="h-4 w-4" />}
      {showText && "Đăng xuất"}
    </button>
  );
}
