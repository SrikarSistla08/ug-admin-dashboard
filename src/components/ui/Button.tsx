"use client";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

export interface UIButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, UIButtonProps>(
  ({ className = "", variant = "secondary", size = "sm", ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded shadow-sm transition-transform duration-150 ease-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
    const sizes: Record<Size, string> = {
      sm: "text-xs px-2 py-1",
      md: "text-sm px-3 py-2",
    };
    const variants: Record<Variant, string> = {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "border border-slate-200 bg-white text-slate-900",
      ghost: "text-slate-700 hover:bg-slate-100",
      danger: "bg-red-600 text-white hover:bg-red-700",
    };
    return (
      <button ref={ref} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props} />
    );
  }
);
Button.displayName = "Button";


