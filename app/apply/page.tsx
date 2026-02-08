import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ApplyContent } from "./content";

export const metadata: Metadata = {
  title: "Apply",
  description:
    "Apply to join the Quantitative Investment Society at Knox College. Learn about our application process and what we look for.",
};

export default function ApplyPage() {
  return (
    <>
      <PageHeader
        label="// JOIN QIS"
        heading="Apply to Join"
        subtext="We recruit every semester. Applications for Spring 2026 are currently open."
      />
      <ApplyContent />
    </>
  );
}
