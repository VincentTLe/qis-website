"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { SectionWrapper } from "./section-wrapper";
import { TECH_TOOLS, COMPETITION_TARGETS } from "@/lib/constants";

function ToolBadge({ name, index }: { name: string; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <motion.span
      ref={ref}
      initial={false}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="rounded-lg border border-border bg-surface px-4 py-2.5 font-mono text-sm text-text-secondary transition-all hover:border-border-hover hover:text-text-primary"
    >
      {name}
    </motion.span>
  );
}

export function TechStack() {
  return (
    <SectionWrapper
      id="tools"
      label="// OUR TOOLKIT"
      heading="Built With"
      className="bg-background-alt"
    >
      <div className="mb-12 flex flex-wrap justify-center gap-3">
        {TECH_TOOLS.map((tool, i) => (
          <ToolBadge key={tool} name={tool} index={i} />
        ))}
      </div>

      <div className="text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-text-tertiary">
          Competition Targets
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {COMPETITION_TARGETS.map((target, i) => (
            <span
              key={target}
              className="rounded-full border border-border px-4 py-1.5 font-mono text-xs text-text-tertiary transition-colors hover:border-border-hover hover:text-text-secondary"
            >
              {target}
            </span>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
