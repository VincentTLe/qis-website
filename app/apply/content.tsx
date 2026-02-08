"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Sparkles, Calculator, Users, Lightbulb, ArrowRight, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { ApplicationProcess } from "@/components/sections/application-process";
import { applicationFAQ } from "@/data/faq";

const qualities = [
  {
    icon: Sparkles,
    title: "Passion for Quant Finance",
    description:
      "Genuine interest in understanding how markets work, what drives asset prices, and how to build systematic strategies.",
  },
  {
    icon: Calculator,
    title: "Strong Quantitative Foundation",
    description:
      "Solid background in math, statistics, or computer science. You don't need to be an expert — just comfortable with numbers.",
  },
  {
    icon: Users,
    title: "Collaborative Team Player",
    description:
      "QIS is a team sport. We value people who share knowledge, help teammates, and contribute to a positive learning environment.",
  },
  {
    icon: Lightbulb,
    title: "Intellectual Curiosity",
    description:
      "The drive to go deep on problems, ask 'why?', and explore ideas beyond the surface. Self-starters thrive here.",
  },
];

export function ApplyContent() {
  const { ref: qualRef, inView: qualInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <>
      {/* Status Badge */}
      <section className="px-6 -mt-8 mb-8">
        <div className="mx-auto max-w-6xl">
          <Badge color="green" className="text-sm px-4 py-1.5">
            Applications Open — Spring 2026
          </Badge>
        </div>
      </section>

      {/* What We Look For */}
      <SectionWrapper
        label="// IDEAL CANDIDATE"
        heading="What We"
        headingAccent="Look For"
        subtext="We value potential over pedigree. Here's what makes a great QIS member."
      >
        <div ref={qualRef} className="grid gap-6 sm:grid-cols-2">
          {qualities.map((qual, i) => {
            const Icon = qual.icon;
            return (
              <motion.div
                key={qual.title}
                initial={false}
                animate={qualInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-blue/10">
                      <Icon size={20} className="text-accent-blue" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-base font-semibold text-text-primary">
                        {qual.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-text-secondary">
                        {qual.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </SectionWrapper>

      {/* Application Process */}
      <SectionWrapper
        label="// HOW IT WORKS"
        heading="Application"
        headingAccent="Process"
        subtext="Our process is designed to be rigorous but fair. We want to get to know you."
        className="bg-background-alt"
      >
        <ApplicationProcess />
      </SectionWrapper>

      {/* Apply CTA */}
      <section className="relative overflow-hidden px-6 py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-green/[0.04] blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-text-primary md:text-4xl">
            Ready to apply?
          </h2>
          <p className="mb-8 text-text-secondary">
            The application takes about 10 minutes. We review applications on a rolling basis.
          </p>
          <a
            href="#"
            className="glow-green inline-flex items-center gap-2 rounded-lg bg-accent-green px-8 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-background transition-all hover:brightness-110"
          >
            Start Application
            <ExternalLink size={16} />
          </a>
        </div>
      </section>

      {/* FAQ */}
      <SectionWrapper
        label="// FAQ"
        heading="Frequently Asked"
        headingAccent="Questions"
        className="bg-background-alt"
      >
        <div className="mx-auto max-w-3xl">
          <FAQAccordion items={applicationFAQ} />
        </div>
      </SectionWrapper>
    </>
  );
}
