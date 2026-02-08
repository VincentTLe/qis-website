import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { GamesContent } from "./content";

export const metadata: Metadata = {
  title: "Games",
  description:
    "Test your quantitative skills with interactive games — mental math challenges, probability estimation, and more.",
};

export default function GamesPage() {
  return (
    <>
      <PageHeader
        label="// GAMES"
        heading="Test Your Quantitative Skills"
        subtext="Sharpen your mental math, train your probability intuition, and climb the leaderboard."
      />
      <GamesContent />
    </>
  );
}
