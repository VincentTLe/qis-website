"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge, getEventBadgeColor } from "@/components/ui/badge";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { events, eventTypeLabels } from "@/data/events";

export function FeaturedEvents() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  // Show the first 3 events sorted by date
  const featured = [...events]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <SectionWrapper
      label="// UPCOMING EVENTS"
      heading="What's"
      headingAccent="Next"
      subtext="Workshops, speaker sessions, and competition prep — there's always something happening at QIS."
    >
      <div ref={ref} className="grid gap-6 md:grid-cols-3">
        {featured.map((event, i) => (
          <motion.div
            key={event.slug}
            initial={false}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link href={`/events/${event.slug}`}>
              <Card className="flex h-full flex-col">
                <Badge color={getEventBadgeColor(event.type)} className="mb-4 self-start">
                  {eventTypeLabels[event.type]}
                </Badge>
                <h3 className="mb-3 text-lg font-semibold text-text-primary">
                  {event.title}
                </h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-text-secondary line-clamp-2">
                  {event.description}
                </p>
                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex items-center gap-2 text-xs text-text-tertiary">
                    <Calendar size={14} />
                    <span className="font-mono">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="font-mono">&middot; {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-tertiary">
                    <MapPin size={14} />
                    <span>{event.location}</span>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={false}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-10 text-center"
      >
        <Link
          href="/events"
          className="inline-flex items-center gap-2 font-mono text-sm text-accent-blue transition-colors hover:text-accent-blue/80"
        >
          View All Events
          <ArrowRight size={16} />
        </Link>
      </motion.div>
    </SectionWrapper>
  );
}
