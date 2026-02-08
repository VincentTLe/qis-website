"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { SectionWrapper } from "./section-wrapper";
import { ROADMAP } from "@/lib/constants";
import { cn } from "@/lib/utils";

function TimelineNode({
  node,
  index,
  isLast,
}: {
  node: (typeof ROADMAP)[number];
  index: number;
  isLast: boolean;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative pl-8"
    >
      {/* Connecting line */}
      {!isLast && (
        <div
          className={cn(
            "absolute left-[7px] top-6 h-full w-px",
            node.active
              ? "bg-gradient-to-b from-accent-green/40 to-border"
              : "bg-border"
          )}
        />
      )}

      {/* Dot */}
      <div
        className={cn(
          "absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2",
          node.active
            ? "pulse-dot border-accent-green bg-accent-green"
            : "border-border bg-background"
        )}
      />

      <div className="pb-12">
        <p
          className={cn(
            "mb-1 font-mono text-xs font-semibold uppercase tracking-[0.15em]",
            node.active ? "text-accent-green" : "text-text-tertiary"
          )}
        >
          {node.phase}
        </p>
        <h3
          className={cn(
            "mb-3 text-lg font-bold",
            node.active ? "text-text-primary" : "text-text-secondary"
          )}
        >
          {node.title}
        </h3>
        <ul className="space-y-1.5">
          {node.items.map((item) => (
            <li
              key={item}
              className={cn(
                "text-sm",
                node.active ? "text-text-secondary" : "text-text-tertiary"
              )}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export function Roadmap() {
  return (
    <SectionWrapper
      id="roadmap"
      label="// THE PIVOT"
      heading="Starting Late."
      headingAccent="Aiming Higher."
      subtext="We built the full 10-week plan. Now we're launching the Beta — one high-impact event to prove the concept, recruit the core team, and set up for a full run in Fall 2026."
    >
      <div className="grid gap-12 md:grid-cols-2">
        <div /> {/* Empty left column — heading content fills from section wrapper */}
        <div>
          {ROADMAP.map((node, i) => (
            <TimelineNode
              key={node.phase}
              node={node}
              index={i}
              isLast={i === ROADMAP.length - 1}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
