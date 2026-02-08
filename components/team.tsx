"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { SectionWrapper } from "./section-wrapper";
import { TEAM } from "@/lib/constants";

function TeamCard({
  member,
  index,
}: {
  member: (typeof TEAM)[number];
  index: number;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const letterInitial = member.role.charAt(0);

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="rounded-lg border border-border bg-surface p-5 transition-colors hover:bg-surface-hover"
    >
      {/* Avatar placeholder */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-background-alt font-mono text-lg font-bold text-text-tertiary">
        {letterInitial}
      </div>
      <p className="mb-1 font-mono text-xs uppercase tracking-wider text-accent-green">
        {member.role}
      </p>
      <p className="mb-1 text-base font-semibold text-text-primary">
        {member.name === "TBD" ? (
          <span className="text-text-tertiary">TBD &mdash; Apply</span>
        ) : (
          member.name
        )}
      </p>
      <p className="text-sm text-text-secondary">{member.focus}</p>
    </motion.div>
  );
}

export function Team() {
  return (
    <SectionWrapper id="team" label="// THE CORE 5" heading="Founding Team">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {TEAM.map((member, i) => (
          <TeamCard key={member.role} member={member} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}
