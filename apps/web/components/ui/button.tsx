"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap",
    "rounded-xl",
    "font-medium",
    "text-sm",
    "transition-all duration-200",
    "select-none",
    "outline-none",
    "cursor-pointer",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "focus-visible:ring-2",
    "focus-visible:ring-indigo-500",
    "focus-visible:ring-offset-2",
    "active:scale-[0.98]",
    "[&_svg]:pointer-events-none",
    "[&_svg]:h-4",
    "[&_svg]:w-4",
    "[&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800",

        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700",

        destructive:
          "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",

        success:
          "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800",

        warning:
          "bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700",

        outline:
          "border border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800",

        ghost:
          "hover:bg-slate-100 dark:hover:bg-slate-800",

        link:
          "text-indigo-600 underline-offset-4 hover:underline p-0 h-auto",

        gradient:
          "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-90",

        glass:
          "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20",
      },

      size: {
        xs: "h-8 px-2 text-xs",

        sm: "h-9 px-3",

        default: "h-10 px-4",

        lg: "h-11 px-6",

        xl: "h-12 px-8 text-base",

        icon: "h-10 w-10 p-0",
      },

      fullWidth: {
        true: "w-full",
        false: "",
      },

      rounded: {
        true: "rounded-full",
        false: "",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
      rounded: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;

  loading?: boolean;

  loadingText?: string;

  leftIcon?: React.ReactNode;

  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      rounded,
      asChild = false,
      loading = false,
      loadingText,
      disabled,
      leftIcon,
      rightIcon,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        type={type}
        aria-busy={loading}
        disabled={disabled || loading}
        data-loading={loading}
        className={cn(
          buttonVariants({
            variant,
            size,
            fullWidth,
            rounded,
          }),
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            {loadingText && (
              <span>{loadingText}</span>
            )}
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

