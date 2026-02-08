"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function JoinCTA() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="relative overflow-hidden px-6 py-24 md:py-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-green/[0.04] blur-[120px]" />
      </div>

      <motion.div
        initial={false}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-3xl text-center"
      >
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent-green">
          // JOIN THE TEAM
        </p>
        <h2 className="mb-6 text-4xl font-bold text-text-primary md:text-5xl">
          Ready to think{" "}
          <span className="gradient-text-green">quantitatively?</span>
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-text-secondary">
          Applications for Spring 2026 are open. Join a community of students
          passionate about algorithms, markets, and building real systems.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/join"
            className="glow-green inline-flex items-center gap-2 rounded-lg bg-accent-green px-8 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-background transition-all hover:brightness-110"
          >
            Join QIS
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-8 py-3.5 font-mono text-sm font-medium uppercase tracking-wider text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
          >
            Learn More
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
