import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ResearchContent } from "./content";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Quantitative research papers, strategy analyses, and technical deep-dives from the QIS research team.",
};

export default function ResearchPage() {
  return (
    <>
      <PageHeader
        label="// RESEARCH"
        heading="Papers & Analysis"
        subtext="Deep dives into quantitative strategies, market microstructure, and systematic trading — written by QIS members."
      />
      <ResearchContent />
    </>
  );
}
