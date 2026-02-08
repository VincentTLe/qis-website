"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Mail, Github, MapPin, Linkedin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/data/site";

const contactCards = [
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    color: "text-accent-blue",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "VincentTLe/qis-website",
    href: siteConfig.github,
    color: "text-text-primary",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "QIS at Knox College",
    href: siteConfig.linkedin,
    color: "text-blue-400",
  },
  {
    icon: MapPin,
    label: "Location",
    value: `${siteConfig.school}, ${siteConfig.location}`,
    href: undefined,
    color: "text-accent-green",
  },
];

export function ContactContent() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-6xl">
        <div ref={ref} className="grid gap-6 sm:grid-cols-2">
          {contactCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={false}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="flex items-start gap-4">
                  <div className={`mt-1 ${card.color}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="mb-1 font-mono text-xs uppercase tracking-wider text-text-tertiary">
                      {card.label}
                    </p>
                    {card.href ? (
                      <a
                        href={card.href}
                        target={card.href.startsWith("mailto") ? undefined : "_blank"}
                        rel={card.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                        className="text-base font-medium text-text-primary transition-colors hover:text-accent-blue"
                      >
                        {card.value}
                      </a>
                    ) : (
                      <p className="text-base font-medium text-text-primary">
                        {card.value}
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Simple contact message */}
        <motion.div
          initial={false}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 glass-card mx-auto max-w-2xl rounded-xl p-8 text-center"
        >
          <h3 className="mb-3 text-xl font-semibold text-text-primary">
            Want to collaborate?
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-text-secondary">
            Whether you&apos;re a company interested in sponsoring, an alumni wanting to mentor,
            or a student with ideas — reach out. We&apos;re always open to new connections.
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-flex items-center gap-2 rounded-lg border border-accent-blue/30 px-6 py-2.5 font-mono text-sm text-accent-blue transition-colors hover:border-accent-blue hover:bg-accent-blue/10"
          >
            <Mail size={16} />
            Send us an email
          </a>
        </motion.div>
      </div>
    </section>
  );
}
