"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  label: string;
  heading: string;
  subtext?: string;
  gradient?: boolean;
  className?: string;
}

export function PageHeader({
  label,
  heading,
  subtext,
  gradient = true,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden px-6 pb-16 pt-32 md:pb-24 md:pt-40",
        className
      )}
    >
      {/* Dot grid background */}
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />

      {/* Radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-accent-blue/5 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent-blue">
            {label}
          </p>
          <h1
            className={cn(
              "text-4xl font-bold leading-tight md:text-5xl lg:text-6xl",
              gradient ? "gradient-text" : "text-text-primary"
            )}
          >
            {heading}
          </h1>
          {subtext && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
              {subtext}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
