"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge, getEventBadgeColor } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Event } from "@/data/events";
import { eventTypeLabels } from "@/data/events";

interface EventDetailContentProps {
  event: Event;
  related: Event[];
  typeLabel: string;
}

export function EventDetailContent({ event, related, typeLabel }: EventDetailContentProps) {
  return (
    <div className="px-6 pb-24 pt-32 md:pt-40">
      <div className="mx-auto max-w-4xl">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/events"
            className="mb-8 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            <ArrowLeft size={16} />
            Back to Events
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Badge color={getEventBadgeColor(event.type)} className="mb-4">
            {typeLabel}
          </Badge>
          <h1 className="mb-6 text-3xl font-bold text-text-primary md:text-4xl lg:text-5xl">
            {event.title}
          </h1>

          {/* Meta bar */}
          <div className="mb-8 flex flex-wrap gap-6 border-b border-border pb-8">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Calendar size={16} className="text-accent-blue" />
              <span className="font-mono">
                {new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Clock size={16} className="text-accent-blue" />
              <span className="font-mono">{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <MapPin size={16} className="text-accent-blue" />
              <span>{event.location}</span>
            </div>
          </div>
        </motion.div>

        {/* Speaker */}
        {event.speaker && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-8 glass-card rounded-xl p-5"
          >
            <p className="mb-1 font-mono text-xs uppercase tracking-wider text-text-tertiary">
              Featured Speaker
            </p>
            <p className="text-lg font-semibold text-text-primary">
              {event.speaker.name}
            </p>
            <p className="text-sm text-text-secondary">{event.speaker.title}</p>
          </motion.div>
        )}

        {/* Long description */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12 space-y-4"
        >
          {event.longDescription.split("\n\n").map((para, i) => (
            <p key={i} className="text-base leading-relaxed text-text-secondary">
              {para}
            </p>
          ))}
        </motion.div>

        {/* Tags */}
        <div className="mb-8 flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <Badge key={tag} color="gray">
              {tag}
            </Badge>
          ))}
        </div>

        {/* RSVP */}
        {event.rsvpUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <a
              href={event.rsvpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-green inline-flex items-center gap-2 rounded-lg bg-accent-green px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-background transition-all hover:brightness-110"
            >
              RSVP Now
              <ExternalLink size={16} />
            </a>
          </motion.div>
        )}

        {/* Related Events */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-border pt-12">
            <h2 className="mb-8 text-2xl font-bold text-text-primary">
              Related Events
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((rel) => (
                <Link key={rel.slug} href={`/events/${rel.slug}`}>
                  <Card className="h-full">
                    <Badge
                      color={getEventBadgeColor(rel.type)}
                      className="mb-3"
                    >
                      {eventTypeLabels[rel.type]}
                    </Badge>
                    <h3 className="mb-2 text-sm font-semibold text-text-primary">
                      {rel.title}
                    </h3>
                    <p className="font-mono text-xs text-text-tertiary">
                      {new Date(rel.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
