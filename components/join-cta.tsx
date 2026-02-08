"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Github, MessageCircle, Check } from "lucide-react";
import { SectionWrapper } from "./section-wrapper";
import { SITE_CONFIG } from "@/lib/constants";

export function JoinCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  }

  return (
    <SectionWrapper
      id="join"
      label="// JOIN THE BETA"
      heading="Ready to Build?"
      subtext="Drop your Knox email to join the QIS founding cohort. We'll reach out with details on our Kick-off Demo Day."
      className="bg-background-alt"
    >
      <motion.div
        ref={ref}
        initial={false}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-xl"
      >
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@knox.edu"
              required
              className="flex-1 rounded-lg border border-border bg-surface px-4 py-3 font-mono text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-colors focus:border-accent-green/50"
            />
            <button
              type="submit"
              className="glow-green rounded-lg bg-accent-green px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-background transition-all hover:brightness-110"
            >
              Join Waitlist &rarr;
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 rounded-lg border border-accent-green/20 bg-accent-green/[0.05] px-6 py-4"
          >
            <Check size={20} className="text-accent-green" />
            <p className="font-mono text-sm text-accent-green">
              You&apos;re on the list. We&apos;ll be in touch.
            </p>
          </motion.div>
        )}

        {/* Secondary CTAs */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <a
            href={SITE_CONFIG.discord}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
          >
            <MessageCircle size={16} />
            Discord
          </a>
          <a
            href={SITE_CONFIG.github}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
          >
            <Github size={16} />
            GitHub
          </a>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
