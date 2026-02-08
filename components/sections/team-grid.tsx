"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Linkedin, Github } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import type { TeamGroup } from "@/data/team";

interface TeamGridProps {
  groups: TeamGroup[];
}

export function TeamGrid({ groups }: TeamGridProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div ref={ref} className="space-y-20">
      {groups.map((group) => (
        <div key={group.section}>
          <motion.div
            initial={false}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-accent-blue">
              {group.label}
            </p>
            <p className="text-sm text-text-secondary">{group.description}</p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {group.members.map((member, i) => (
              <motion.div
                key={`${member.role}-${i}`}
                initial={false}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Card className="text-center">
                  <PlaceholderImage
                    initials={member.name === "TBD" ? "?" : member.name.split(" ").map(n => n[0]).join("")}
                    className="mx-auto mb-4 h-20 w-20 rounded-full"
                  />
                  <h3 className="text-lg font-semibold text-text-primary">
                    {member.name}
                  </h3>
                  <p className="mt-1 font-mono text-xs uppercase tracking-wider text-accent-green">
                    {member.role}
                  </p>
                  <p className="mt-1 text-xs text-text-tertiary">{member.focus}</p>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    {member.bio}
                  </p>
                  <p className="mt-2 font-mono text-xs text-text-tertiary">
                    {member.year}
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-3">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-tertiary transition-colors hover:text-accent-blue"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <Linkedin size={16} />
                      </a>
                    )}
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-tertiary transition-colors hover:text-text-primary"
                        aria-label={`${member.name} GitHub`}
                      >
                        <Github size={16} />
                      </a>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
