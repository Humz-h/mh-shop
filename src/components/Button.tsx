import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium transition-colors";
  const variants: Record<string, string> = {
    primary: "bg-black text-white hover:bg-black/90",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    ghost: "bg-transparent text-gray-900 hover:bg-gray-100",
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
} 