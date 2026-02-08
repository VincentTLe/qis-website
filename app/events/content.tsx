"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge, getEventBadgeColor } from "@/components/ui/badge";
import { events, eventTypeLabels } from "@/data/events";
import { cn } from "@/lib/utils";

type FilterTab = "all" | "upcoming" | "past";

export function EventsContent() {
  const [filter, setFilter] = useState<FilterTab>("all");
  const now = new Date();

  const filteredEvents = events
    .filter((e) => {
      if (filter === "upcoming") return new Date(e.date) >= now;
      if (filter === "past") return new Date(e.date) < now;
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const tabs: { label: string; value: FilterTab }[] = [
    { label: "All Events", value: "all" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Past", value: "past" },
  ];

  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-6xl">
        {/* Filter Tabs */}
        <div className="mb-10 flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={cn(
                "rounded-lg px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer",
                filter === tab.value
                  ? "bg-accent-blue/10 text-accent-blue border border-accent-blue/20"
                  : "text-text-tertiary hover:text-text-secondary border border-transparent"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event, i) => (
            <motion.div
              key={event.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link href={`/events/${event.slug}`}>
                <Card className="flex h-full flex-col">
                  <Badge
                    color={getEventBadgeColor(event.type)}
                    className="mb-4 self-start"
                  >
                    {eventTypeLabels[event.type]}
                  </Badge>
                  <h3 className="mb-2 text-lg font-semibold text-text-primary">
                    {event.title}
                  </h3>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-text-secondary line-clamp-3">
                    {event.description}
                  </p>
                  {event.speaker && (
                    <p className="mb-3 text-xs text-text-tertiary">
                      Speaker: <span className="text-text-secondary">{event.speaker.name}</span>
                    </p>
                  )}
                  <div className="space-y-2 border-t border-border pt-4">
                    <div className="flex items-center gap-2 text-xs text-text-tertiary">
                      <Calendar size={14} />
                      <span className="font-mono">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
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

        {filteredEvents.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-text-tertiary">No events found for this filter.</p>
          </div>
        )}
      </div>
    </section>
  );
}
