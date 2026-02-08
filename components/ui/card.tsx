"use client";

import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

interface CardProps extends HTMLMotionProps<"div"> {
  hover?: boolean;
  glow?: "green" | "blue" | "none";
  children: React.ReactNode;
}

export function Card({
  hover = true,
  glow = "none",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <motion.div
      className={cn(
        "glass-card rounded-xl p-6",
        hover && "transition-all duration-300 hover:scale-[1.02] hover:border-border-hover",
        glow === "green" && "glow-green",
        glow === "blue" && "glow-blue",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
