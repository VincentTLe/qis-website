"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Award, BookOpen, Handshake, Code } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Timeline } from "@/components/sections/timeline";

const credentials = [
  {
    icon: Award,
    tag: "COMPETITION",
    title: "Top 1% — IMC Prosperity 3",
    body: "Ranked in the top 1% globally out of 12,000+ teams. Built pairs-trading algorithms using statistical arbitrage and mean-reversion strategies under simulated exchange conditions.",
  },
  {
    icon: Code,
    tag: "RESEARCH",
    title: "Pairs Trading Pipeline — 18% Returns",
    body: "End-to-end pipeline: cointegration testing, dynamic hedge ratios, z-score signal generation, and rigorous backtesting with walk-forward validation.",
  },
  {
    icon: BookOpen,
    tag: "FOUNDATION",
    title: "Mathematics & Data Science",
    body: "Grounded in probability theory, statistical inference, and machine learning. Every strategy we teach comes with math first, code second.",
  },
  {
    icon: Handshake,
    tag: "OPEN SOURCE",
    title: "Everything Ships to GitHub",
    body: "Notes, notebooks, simulators, scoreboards — all version-controlled, all runnable from a clean checkout. Your portfolio grows every week you participate.",
  },
];

const roadmap = [
  {
    phase: "SPRING 2026",
    title: "Beta Launch",
    active: true,
    items: [
      "Kick-off / Demo Day event",
      "Core team recruitment",
      "Constitution ratified",
      "Advisor confirmed: Prof. Andrew Leahy",
    ],
  },
  {
    phase: "FALL 2026",
    title: "Full 10-Week Algo Curriculum",
    active: false,
    items: [
      "Weekly Learn → Build → Compete meetings",
      "Competition team formation (IMC, Optiver)",
      "GitHub showcase portfolio",
      "Internal leaderboard + points system",
    ],
  },
  {
    phase: "2027+",
    title: "Scale & Specialize",
    active: false,
    items: [
      "Project pods: equities, derivatives, market making",
      "Campus-wide quant challenge",
      "Alumni network & mentorship pipeline",
    ],
  },
];

const curriculum = [
  { week: 1, title: "Kickoff + Tools + Quant Mindset", artifact: "repo + metrics notebook", highlight: true },
  { week: 2, title: "Probability & Expected Value", artifact: "Monte Carlo sim + write-up" },
  { week: 3, title: "Market Microstructure Basics", artifact: "order book sim + scoreboard" },
  { week: 4, title: "Options 101: Payoffs & Parity", artifact: "payoff / parity lab" },
  { week: 5, title: "Greeks & Hedging (Light Week)", artifact: "finite-diff Greeks + hedge game" },
  { week: 6, title: "Volatility + Risk Metrics", artifact: "risk report notebook" },
  { week: 7, title: "Backtesting Hygiene", artifact: "leak demo + hygiene checklist" },
  { week: 8, title: "Competition Sprint", artifact: "prototype + README" },
  { week: 9, title: "Showcase Day", artifact: "demos + awards + recruiting", highlight: true },
];

export function AboutContent() {
  const { ref: credRef, inView: credInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: currRef, inView: currInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <>
      {/* What Sets Us Apart */}
      <SectionWrapper
        label="// CREDENTIALS"
        heading="What Sets Us"
        headingAccent="Apart"
        subtext="Real results from rigorous process. Here's what we've accomplished."
      >
        <div ref={credRef} className="grid gap-6 sm:grid-cols-2">
          {credentials.map((cred, i) => {
            const Icon = cred.icon;
            return (
              <motion.div
                key={cred.tag}
                initial={false}
                animate={credInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-green/10">
                      <Icon size={20} className="text-accent-green" />
                    </div>
                    <span className="font-mono text-xs uppercase tracking-wider text-accent-green">
                      {cred.tag}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-text-primary">
                    {cred.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {cred.body}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </SectionWrapper>

      {/* Curriculum */}
      <SectionWrapper
        label="// 10-WEEK PROGRAM"
        heading="Algo"
        headingAccent="Curriculum"
        subtext="A structured, hands-on program taking you from fundamentals to competition-ready strategies."
        className="bg-background-alt"
      >
        <div ref={currRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {curriculum.map((week, i) => (
            <motion.div
              key={week.week}
              initial={false}
              animate={currInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`glass-card rounded-xl p-5 ${week.highlight ? "border-accent-green/30" : ""}`}
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-text-tertiary">
                  W{week.week}
                </span>
                <h3 className="text-sm font-semibold text-text-primary">
                  {week.title}
                </h3>
              </div>
              <p className="mt-2 font-mono text-xs text-text-tertiary">
                {week.artifact}
              </p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Roadmap */}
      <SectionWrapper
        label="// ROADMAP"
        heading="Where We're"
        headingAccent="Going"
        subtext="Our phased plan for building a world-class quantitative finance community at Knox."
      >
        <Timeline milestones={roadmap} />
      </SectionWrapper>
    </>
  );
}
