"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/use-mounted";

interface SectionWrapperProps {
  id?: string;
  label?: string;
  heading?: string;
  headingAccent?: string;
  subtext?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function SectionWrapper({
  id,
  label,
  heading,
  headingAccent,
  subtext,
  children,
  className,
  containerClassName,
}: SectionWrapperProps) {
  const mounted = useMounted();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const show = mounted && inView;

  return (
    <section
      id={id}
      ref={ref}
      className={cn("py-24 md:py-32 lg:py-40 px-6", className)}
    >
      <div className={cn("mx-auto max-w-6xl", containerClassName)}>
        {(label || heading) && (
          <motion.div
            initial={false}
            animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-16"
          >
            {label && (
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-text-secondary">
                {label}
              </p>
            )}
            {heading && (
              <h2 className="text-4xl font-bold leading-tight text-text-primary md:text-5xl">
                {heading}
                {headingAccent && (
                  <span className="text-accent-green"> {headingAccent}</span>
                )}
              </h2>
            )}
            {subtext && (
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-secondary">
                {subtext}
              </p>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}
