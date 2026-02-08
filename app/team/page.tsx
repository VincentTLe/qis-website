import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { TeamGrid } from "@/components/sections/team-grid";
import { teamGroups } from "@/data/team";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the founding leadership team of the Quantitative Investment Society at Knox College.",
};

export default function TeamPage() {
  return (
    <>
      <PageHeader
        label="// OUR TEAM"
        heading="The People Behind QIS"
        subtext="A dedicated group of students building Knox College's premier quantitative finance community."
      />
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <TeamGrid groups={teamGroups} />
        </div>
      </section>
    </>
  );
}
