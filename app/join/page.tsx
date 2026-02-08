import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { JoinContent } from "./content";

export const metadata: Metadata = {
  title: "Join",
  description:
    "Become a member of the Quantitative Investment Society at Knox College. Open to all students, no prior experience required.",
};

export default function JoinPage() {
  return (
    <>
      <PageHeader
        label="// JOIN"
        heading="Become a Member"
        subtext="Open to all Knox College students interested in quantitative finance. No prior experience required."
      />
      <JoinContent />
    </>
  );
}
