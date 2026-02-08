"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { UserPlus, MessageCircle, Instagram } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { joinFAQ } from "@/data/faq";
import { siteConfig } from "@/data/site";

const ctaCards = [
  {
    icon: UserPlus,
    title: "Sign Up Now",
    description: "Create your member account to check into events, participate in games, and connect with sponsors.",
    href: siteConfig.applyUrl,
    color: "accent-green",
    glowClass: "glow-green",
    buttonClass: "bg-accent-green text-background hover:brightness-110",
  },
  {
    icon: MessageCircle,
    title: "Join Discord",
    description: "Join our Discord server for announcements, study groups, competition prep, and community discussion.",
    href: siteConfig.discord,
    color: "accent-blue",
    glowClass: "glow-blue",
    buttonClass: "bg-accent-blue text-white hover:brightness-110",
  },
  {
    icon: Instagram,
    title: "Follow Instagram",
    description: "Stay updated on events, highlights, and behind-the-scenes content from QIS.",
    href: siteConfig.instagram,
    color: "purple-400",
    glowClass: "",
    buttonClass: "bg-purple-500 text-white hover:brightness-110",
  },
];

export function JoinContent() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <>
      {/* CTA Cards */}
      <section className="px-6 pb-16">
        <div ref={ref} className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
          {ctaCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={false}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  <Card className={`flex h-full flex-col items-center text-center p-8 ${card.glowClass}`}>
                    <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-${card.color}/10`}>
                      <Icon size={32} className={`text-${card.color}`} />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-text-primary">
                      {card.title}
                    </h3>
                    <p className="mb-6 flex-1 text-sm leading-relaxed text-text-secondary">
                      {card.description}
                    </p>
                    <span className={`inline-flex w-full items-center justify-center rounded-lg px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider transition-all ${card.buttonClass}`}>
                      {card.title}
                    </span>
                  </Card>
                </a>
              </motion.div>
            );
          })}
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
          <FAQAccordion items={joinFAQ} />
        </div>
      </SectionWrapper>
    </>
  );
}
