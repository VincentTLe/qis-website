"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Trophy, Users, Calendar, ExternalLink, ArrowRight, Swords, Target, BarChart3 } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { competitions } from "@/data/competitions";

const compIcons: Record<string, typeof Trophy> = {
  "imc-prosperity": BarChart3,
  "jane-street-puzzles": Target,
  "optiver-ready-trader-go": Swords,
  "citadel-datathon": BarChart3,
};

const steps = [
  { step: "01", title: "Join QIS", description: "Become a member and attend workshops to build your foundation." },
  { step: "02", title: "Complete Training", description: "Finish relevant curriculum modules for your target competition." },
  { step: "03", title: "Form a Team", description: "Team up with fellow members during our competition prep sessions." },
  { step: "04", title: "Compete", description: "Represent QIS on the global stage and aim for the top." },
];

export function CompetitionContent() {
  const { ref: featRef, inView: featInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: gridRef, inView: gridInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: stepsRef, inView: stepsInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const featured = competitions.find((c) => c.featured);
  const others = competitions.filter((c) => !c.featured);

  return (
    <>
      {/* Featured Result */}
      {featured && featured.results && featured.results.length > 0 && (
        <section className="px-6 pb-16">
          <div ref={featRef} className="mx-auto max-w-6xl">
            <motion.div
              initial={false}
              animate={featInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.6 }}
            >
              <div className="glass-card glow-green rounded-2xl p-8 md:p-12">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <Badge color="green" className="mb-4">Latest Result</Badge>
                    <h2 className="mb-2 text-3xl font-bold text-text-primary md:text-4xl">
                      {featured.results[0].placement}
                    </h2>
                    <p className="mb-1 text-xl font-semibold text-accent-green">
                      {featured.name}
                    </p>
                    <p className="max-w-lg text-sm leading-relaxed text-text-secondary">
                      {featured.results[0].details}
                    </p>
                  </div>
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-accent-green/10">
                    <Trophy size={48} className="text-accent-green" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* All Competitions */}
      <SectionWrapper
        label="// OUR COMPETITIONS"
        heading="Where We"
        headingAccent="Compete"
        subtext="From algorithmic trading to data science, we target the most prestigious competitions in quantitative finance."
      >
        <div ref={gridRef} className="grid gap-6 md:grid-cols-2">
          {competitions.map((comp, i) => {
            const Icon = compIcons[comp.slug] || Trophy;
            return (
              <motion.div
                key={comp.slug}
                initial={false}
                animate={gridInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-blue/10">
                      <Icon size={24} className="text-accent-blue" />
                    </div>
                    {comp.results && comp.results.length > 0 && (
                      <Badge color="green">{comp.results[0].placement}</Badge>
                    )}
                  </div>
                  <h3 className="mb-1 text-lg font-bold text-text-primary">
                    {comp.name}
                  </h3>
                  <p className="mb-3 font-mono text-xs text-text-tertiary">
                    by {comp.organizer}
                  </p>
                  <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                    {comp.description}
                  </p>
                  <div className="space-y-2 border-t border-border pt-4">
                    <div className="flex items-center gap-2 text-xs text-text-tertiary">
                      <Users size={14} />
                      <span>{comp.teamSize}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-tertiary">
                      <Calendar size={14} />
                      <span>{comp.timeline}</span>
                    </div>
                  </div>
                  <a
                    href={comp.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs text-accent-blue transition-colors hover:text-accent-blue/80"
                  >
                    Visit Website <ExternalLink size={12} />
                  </a>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </SectionWrapper>

      {/* How to Get Involved */}
      <SectionWrapper
        label="// GET INVOLVED"
        heading="How to Join a"
        headingAccent="Competition Team"
        subtext="Follow these steps to represent QIS in our next competition."
        className="bg-background-alt"
      >
        <div ref={stepsRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={false}
              animate={stepsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card hover={false} className="text-center">
                <p className="mb-2 font-mono text-2xl font-bold text-accent-green">
                  {item.step}
                </p>
                <h4 className="mb-2 text-base font-semibold text-text-primary">
                  {item.title}
                </h4>
                <p className="text-xs leading-relaxed text-text-secondary">
                  {item.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={false}
          animate={stepsInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <Link
            href="/join"
            className="inline-flex items-center gap-2 font-mono text-sm text-accent-green transition-colors hover:text-accent-green/80"
          >
            Join QIS to get started
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </SectionWrapper>
    </>
  );
}
