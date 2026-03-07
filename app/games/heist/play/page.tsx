import type { Metadata } from "next";
import { PlayerContent } from "./content";

export const metadata: Metadata = {
  title: "The Heist — Play",
  description: "Join The Heist and submit your decisions.",
};

export default function HeistPlayPage() {
  return <PlayerContent />;
}
