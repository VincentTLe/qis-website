"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { SectionWrapper } from "./section-wrapper";
import { PHILOSOPHY_PILLARS } from "@/lib/constants";

function Pillar({
  pillar,
  index,
}: {
  pillar: (typeof PHILOSOPHY_PILLARS)[number];
  index: number;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative"
    >
      <p className="mb-4 text-6xl font-bold text-border md:text-7xl">
        {pillar.number}
      </p>
      <div className="mb-4 h-0.5 w-10 bg-accent-green" />
      <h3 className="mb-3 text-2xl font-bold text-text-primary">
        {pillar.title}
      </h3>
      <p className="mb-6 text-sm leading-relaxed text-text-secondary">
        {pillar.body}
      </p>
      <p className="font-mono text-xs text-text-tertiary">{pillar.output}</p>
    </motion.div>
  );
}

export function Philosophy() {
  const { ref: calloutRef, inView: calloutInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <SectionWrapper
      id="philosophy"
      label="// OUR OPERATING SYSTEM"
      heading="No Vibes."
      headingAccent="Just Artifacts."
      className="bg-background-alt"
    >
      <div className="mb-20 grid gap-12 md:grid-cols-3 md:gap-8">
        {PHILOSOPHY_PILLARS.map((pillar, i) => (
          <Pillar key={pillar.title} pillar={pillar} index={i} />
        ))}
      </div>

      {/* Artifact Rule callout */}
      <motion.div
        ref={calloutRef}
        initial={false}
        animate={calloutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl rounded-lg border border-accent-green/15 bg-gradient-to-r from-accent-green/[0.04] to-accent-blue/[0.04] p-8"
      >
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-green">
          The Artifact Rule (Non-Negotiable)
        </p>
        <p className="text-sm leading-relaxed text-text-secondary">
          Every meeting produces at least two artifacts: a one-page note and a
          runnable lab. If artifacts are missing, that meeting did not count.
        </p>
      </motion.div>
    </SectionWrapper>
  );
}
