import type { Metadata } from "next";
import { HistoryContent } from "./content";

export const metadata: Metadata = {
  title: "The Heist — History",
  description: "Past Heist game sessions.",
};

export default function HeistHistoryPage() {
  return <HistoryContent />;
}
