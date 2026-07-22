"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {}

export default function GlassCard({
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-[32px]",
        "border border-white/20",
        "bg-white/60",
        "backdrop-blur-2xl",
        "shadow-[0_20px_60px_rgba(15,23,42,.08)]",
        "transition-all duration-500",
        "hover:-translate-y-1",
        "hover:shadow-[0_40px_100px_rgba(37,99,235,.15)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
