import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { CompetitionContent } from "./content";

export const metadata: Metadata = {
  title: "Competitions",
  description:
    "QIS competes in top quantitative trading and data science competitions worldwide. IMC Prosperity, Jane Street, Optiver, and more.",
};

export default function CompetitionPage() {
  return (
    <>
      <PageHeader
        label="// COMPETITIONS"
        heading="Compete at the Highest Level"
        subtext="We participate in the world's top quantitative finance competitions, testing our strategies against thousands of teams globally."
      />
      <CompetitionContent />
    </>
  );
}
