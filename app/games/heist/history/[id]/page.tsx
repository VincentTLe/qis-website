import type { Metadata } from "next";
import { SessionDetailContent } from "./content";

export const metadata: Metadata = {
  title: "The Heist — Session Detail",
  description: "Detailed results for a Heist game session.",
};

export default function HeistSessionDetailPage() {
  return <SessionDetailContent />;
}
