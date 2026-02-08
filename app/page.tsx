import { Hero } from "@/components/sections/hero";
import { StatsBar } from "@/components/sections/stats-bar";
import { Pillars } from "@/components/sections/pillars";
import { FeaturedEvents } from "@/components/sections/featured-events";
import { JoinCTA } from "@/components/sections/join-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <Pillars />
      <FeaturedEvents />
      <JoinCTA />
    </>
  );
}
