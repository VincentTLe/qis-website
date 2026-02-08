"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Brain, Code, Trophy, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { pillars } from "@/data/site";

const iconMap = {
  brain: Brain,
  code: Code,
  trophy: Trophy,
  users: Users,
} as const;

export function Pillars() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <SectionWrapper
      label="// WHAT WE DO"
      heading="Four Pillars of"
      headingAccent="QIS"
      subtext="We combine rigorous quantitative research with hands-on engineering and real competition experience."
    >
      <div ref={ref} className="grid gap-6 sm:grid-cols-2">
        {pillars.map((pillar, i) => {
          const Icon = iconMap[pillar.icon];
          return (
            <motion.div
              key={pillar.number}
              initial={false}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="h-full">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent-blue/10 text-accent-blue">
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="mb-1 font-mono text-xs text-text-tertiary">
                      {pillar.number}
                    </p>
                    <h3 className="mb-2 text-lg font-semibold text-text-primary">
                      {pillar.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-text-secondary">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
