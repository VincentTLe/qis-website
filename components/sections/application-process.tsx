"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FileText, Search, MessageSquare, CheckCircle, Users } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Submit Application",
    description: "Fill out a short form telling us about yourself, your interests, and what excites you about quantitative finance.",
  },
  {
    icon: Search,
    title: "Resume Screening",
    description: "We review applications holistically — looking for curiosity, quantitative aptitude, and collaborative spirit.",
  },
  {
    icon: MessageSquare,
    title: "Technical Interview",
    description: "A casual conversation covering probability, logic, and basic programming. No trick questions — we want to see how you think.",
  },
  {
    icon: CheckCircle,
    title: "Final Decision",
    description: "Decisions are released within one week. We notify all applicants regardless of outcome.",
  },
  {
    icon: Users,
    title: "Onboarding",
    description: "Welcome to QIS! Get set up with GitHub, Slack, and your first week's materials. Meet your team.",
  },
];

export function ApplicationProcess() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div ref={ref}>
      {/* Desktop: horizontal */}
      <div className="hidden md:block">
        <div className="relative flex items-start justify-between">
          {/* Connector line */}
          <div className="absolute top-6 left-6 right-6 h-px bg-border" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={false}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex w-1/5 flex-col items-center text-center"
              >
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface">
                  <Icon size={20} className="text-accent-blue" />
                </div>
                <p className="mt-3 font-mono text-xs text-accent-green">
                  Step {i + 1}
                </p>
                <h4 className="mt-1 text-sm font-semibold text-text-primary">
                  {step.title}
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile: vertical */}
      <div className="space-y-6 md:hidden">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              initial={false}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface">
                <Icon size={18} className="text-accent-blue" />
              </div>
              <div>
                <p className="font-mono text-xs text-accent-green">Step {i + 1}</p>
                <h4 className="text-sm font-semibold text-text-primary">
                  {step.title}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
