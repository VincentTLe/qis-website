"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { stats } from "@/data/site";

export function StatsBar() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section ref={ref} className="border-y border-border bg-background-alt px-6 py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4 md:gap-0 md:divide-x md:divide-border">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={false}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex flex-col items-center text-center md:px-8"
          >
            <p className="font-mono text-3xl font-bold text-accent-green md:text-4xl">
              {stat.label === "IMC Prosperity 3" ? "TOP " : ""}
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-2 text-sm font-medium text-text-primary">
              {stat.label}
            </p>
            <p className="mt-1 font-mono text-xs text-text-tertiary">
              {stat.sublabel}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
