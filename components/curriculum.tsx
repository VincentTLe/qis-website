"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { SectionWrapper } from "./section-wrapper";
import { CURRICULUM_WEEKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

function WeekCard({
  week,
  index,
}: {
  week: (typeof CURRICULUM_WEEKS)[number];
  index: number;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={cn(
        "rounded-lg border p-5 transition-colors",
        week.highlight
          ? "border-accent-green/30 bg-accent-green/[0.04]"
          : "border-border bg-surface hover:bg-surface-hover"
      )}
    >
      <span
        className={cn(
          "mb-3 inline-block rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold",
          week.highlight
            ? "bg-accent-green/15 text-accent-green"
            : "bg-background-alt text-text-secondary"
        )}
      >
        W{week.week}
      </span>
      <h3 className="mb-2 text-sm font-semibold text-text-primary">
        {week.title}
      </h3>
      <p className="font-mono text-xs text-text-tertiary">{week.artifact}</p>
    </motion.div>
  );
}

export function Curriculum() {
  const { ref: footerRef, inView: footerInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <SectionWrapper
      id="curriculum"
      label="// 10-WEEK OPERATING PLAN"
      heading="The Curriculum"
      subtext="Structured progression from probability fundamentals to competition-grade prototypes. Every week ships something real."
    >
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CURRICULUM_WEEKS.map((week, i) => (
          <WeekCard key={week.week} week={week} index={i} />
        ))}
      </div>

      <motion.div
        ref={footerRef}
        initial={false}
        animate={footerInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-lg border border-dashed border-border p-4 text-center"
      >
        <p className="font-mono text-sm text-text-tertiary">
          Week 10 &rarr; async finals-mode handoff (no in-person meeting)
        </p>
      </motion.div>
    </SectionWrapper>
  );
}
