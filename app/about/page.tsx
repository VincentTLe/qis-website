import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { AboutContent } from "./content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about the Quantitative Investment Society at Knox College — our mission, values, curriculum, and what sets us apart.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        label="// ABOUT US"
        heading="Mission & Vision"
        subtext="QIS is Knox College's quantitative finance society — a community of students passionate about algorithms, markets, and systematic thinking."
      />
      <AboutContent />
    </>
  );
}
