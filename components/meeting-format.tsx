"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { SectionWrapper } from "./section-wrapper";
import { MEETING_BLOCKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

function TimeBlock({
  block,
  index,
}: {
  block: (typeof MEETING_BLOCKS)[number];
  index: number;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn(
        "rounded-lg border p-6",
        block.emphasis
          ? "border-accent-green/20 border-t-2 border-t-accent-green bg-accent-green/[0.03]"
          : "border-border bg-surface"
      )}
    >
      <p className="mb-2 font-mono text-lg font-bold text-accent-green">
        {block.time}
      </p>
      <h3 className="mb-2 text-lg font-bold text-text-primary">
        {block.label}
      </h3>
      <p className="text-sm text-text-secondary">{block.description}</p>
    </motion.div>
  );
}

export function MeetingFormat() {
  return (
    <SectionWrapper
      id="meeting"
      label="// EVERY SUNDAY · 90 MINUTES"
      heading="The Meeting Template"
      className="bg-background-alt"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MEETING_BLOCKS.map((block, i) => (
          <TimeBlock key={block.label} block={block} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}
