"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function FloatingCard({
  children,
  className,
}: Props) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        repeat: Infinity,
        duration: 4,
      }}
      className={cn(
        "rounded-3xl border bg-white p-6 shadow-xl",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
