import type { Metadata } from "next";
import { ProjectorContent } from "./content";

export const metadata: Metadata = {
  title: "The Heist — Projector",
  description: "Live leaderboard for The Heist.",
};

export default function HeistProjectorPage() {
  return <ProjectorContent />;
}
