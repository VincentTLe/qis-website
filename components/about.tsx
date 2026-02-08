"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { SectionWrapper } from "./section-wrapper";
import { CREDENTIALS } from "@/lib/constants";

function CredentialCard({
  credential,
  index,
}: {
  credential: (typeof CREDENTIALS)[number];
  index: number;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.01, borderColor: "rgba(42, 42, 58, 1)" }}
      className="group rounded-lg border border-border bg-surface p-6 transition-colors hover:bg-surface-hover"
    >
      <p className="mb-3 font-mono text-xs tracking-wider text-accent-green">
        {credential.tag}
      </p>
      <h3 className="mb-3 text-lg font-bold text-text-primary">
        {credential.title}
      </h3>
      <p className="text-sm leading-relaxed text-text-secondary">
        {credential.body}
      </p>
    </motion.div>
  );
}

export function About() {
  return (
    <SectionWrapper
      id="about"
      label="// PROOF OF CONCEPT"
      heading="Led by Builders, Not Buzzwords."
      subtext="Our founding team doesn't just talk about quant — we've competed globally, built production pipelines, and shipped real returns."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {CREDENTIALS.map((cred, i) => (
          <CredentialCard key={cred.title} credential={cred} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}
