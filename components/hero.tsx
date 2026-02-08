"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { useMounted } from "@/lib/use-mounted";

export function Hero() {
  const mounted = useMounted();
  const headlineWords = ["We Learn.", "We Build.", "We Compete."];

  return (
    <section className="hero-gradient dot-grid relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-green/[0.03] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Mono label */}
        <motion.p
          initial={false}
          animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 font-mono text-xs uppercase tracking-[0.25em] text-text-secondary"
          style={!mounted ? { opacity: 0, transform: "translateY(20px)" } : undefined}
        >
          {SITE_CONFIG.school} &middot; Established {SITE_CONFIG.established}
        </motion.p>

        {/* Main headline */}
        <div className="mb-8">
          {headlineWords.map((word, i) => (
            <motion.h1
              key={word}
              initial={false}
              animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.12 }}
              className="text-5xl font-bold leading-[0.95] text-text-primary sm:text-6xl md:text-7xl lg:text-8xl"
              style={!mounted ? { opacity: 0, transform: "translateY(30px)" } : undefined}
            >
              {word}
            </motion.h1>
          ))}
        </div>

        {/* Subheadline */}
        <motion.p
          initial={false}
          animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mx-auto mb-10 max-w-xl font-mono text-base leading-relaxed text-text-secondary md:text-lg"
          style={!mounted ? { opacity: 0, transform: "translateY(20px)" } : undefined}
        >
          Knox College&apos;s premier {SITE_CONFIG.name}.
          <br />
          Algorithms. Markets. Edge.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={false}
          animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          style={!mounted ? { opacity: 0, transform: "translateY(20px)" } : undefined}
        >
          <a
            href="#join"
            className="glow-green inline-flex items-center gap-2 rounded-lg bg-accent-green px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-background transition-all hover:brightness-110"
          >
            Join Beta
          </a>
          <a
            href="#about"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-mono text-sm font-medium uppercase tracking-wider text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
          >
            Learn More
            <ChevronDown size={16} />
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={false}
        animate={mounted ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        style={!mounted ? { opacity: 0 } : undefined}
      >
        <ChevronDown
          size={20}
          className="scroll-bounce text-text-tertiary"
        />
      </motion.div>
    </section>
  );
}
