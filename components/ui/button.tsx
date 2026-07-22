"use client";

import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;

  loading?: boolean;

  variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "outline"
    | "danger"
    | "gradient";

  fullWidth?: boolean;
}

const variants = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700",

  secondary:
    "bg-slate-700 text-white hover:bg-slate-800",

  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100",

  outline:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",

  danger:
    "bg-red-600 text-white hover:bg-red-700",

  gradient:
    "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90",
};

export function Button({
  children,
  loading = false,
  disabled = false,
  className = "",
  variant = "primary",
  fullWidth = true,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={[
        "inline-flex items-center justify-center rounded-lg px-4 py-3 font-medium transition",
        fullWidth ? "w-full" : "",
        variants[variant],
        className,
      ].join(" ")}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export default Button;
