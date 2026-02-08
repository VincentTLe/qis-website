import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { EventsContent } from "./content";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Workshops, speaker sessions, competitions, and socials — explore upcoming and past QIS events.",
};

export default function EventsPage() {
  return (
    <>
      <PageHeader
        label="// EVENTS"
        heading="Workshops, Lectures & Competitions"
        subtext="From options pricing workshops to competition prep sessions, there's always something happening at QIS."
      />
      <EventsContent />
    </>
  );
}
