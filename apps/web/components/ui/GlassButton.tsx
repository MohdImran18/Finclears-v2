"use client";

import { cn } from "@/lib/utils";

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export default function GlassButton({
  className,
  children,
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "rounded-xl border border-white/20",
        "bg-white/10",
        "backdrop-blur-xl",
        "px-6 py-3",
        "font-semibold",
        "text-white",
        "transition",
        "hover:bg-white/20",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
