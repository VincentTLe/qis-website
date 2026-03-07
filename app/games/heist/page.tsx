import type { Metadata } from "next";
import { HeistLanding } from "./content";

export const metadata: Metadata = {
  title: "The Heist",
  description: "Live multiplayer public-goods betrayal game. Contribute, audit, and outsmart your rivals.",
};

export default function HeistPage() {
  return <HeistLanding />;
}
