"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

interface TimelineItem {
  phase: string;
  title: string;
  active: boolean;
  items: string[];
}

interface TimelineProps {
  milestones: TimelineItem[];
}

export function Timeline({ milestones }: TimelineProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div ref={ref} className="relative space-y-8">
      {/* Vertical line */}
      <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-px" />

      {milestones.map((milestone, i) => (
        <motion.div
          key={milestone.phase}
          initial={false}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5, delay: i * 0.15 }}
          className={cn(
            "relative flex items-start gap-6 md:gap-0",
            i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
          )}
        >
          {/* Dot */}
          <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
            <div
              className={cn(
                "h-3 w-3 rounded-full border-2",
                milestone.active
                  ? "border-accent-green bg-accent-green pulse-dot"
                  : "border-border bg-surface"
              )}
            />
          </div>

          {/* Content */}
          <div
            className={cn(
              "glass-card flex-1 rounded-xl p-6 md:w-[45%]",
              i % 2 === 0 ? "md:mr-auto md:pr-12" : "md:ml-auto md:pl-12"
            )}
          >
            <p className="mb-1 font-mono text-xs uppercase tracking-[0.15em] text-accent-green">
              {milestone.phase}
            </p>
            <h3 className="mb-3 text-lg font-semibold text-text-primary">
              {milestone.title}
            </h3>
            <ul className="space-y-2">
              {milestone.items.map((item, j) => (
                <li
                  key={j}
                  className="flex items-start gap-2 text-sm text-text-secondary"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-text-tertiary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
