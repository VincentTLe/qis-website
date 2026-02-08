import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { events, getEventBySlug, getRelatedEvents, eventTypeLabels } from "@/data/events";
import { EventDetailContent } from "./content";

export function generateStaticParams() {
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const event = getEventBySlug(params.slug);
  if (!event) return {};
  return {
    title: `${event.title} | Events`,
    description: event.description,
  };
}

export default function EventDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const event = getEventBySlug(params.slug);
  if (!event) notFound();

  const related = getRelatedEvents(params.slug, 3);
  const typeLabel = eventTypeLabels[event.type];

  return <EventDetailContent event={event} related={related} typeLabel={typeLabel} />;
}
