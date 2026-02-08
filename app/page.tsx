import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { StatsBar } from "@/components/stats-bar";
import { About } from "@/components/about";
import { Philosophy } from "@/components/philosophy";
import { Curriculum } from "@/components/curriculum";
import { MeetingFormat } from "@/components/meeting-format";
import { Roadmap } from "@/components/roadmap";
import { TechStack } from "@/components/tech-stack";
import { Team } from "@/components/team";
import { JoinCTA } from "@/components/join-cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <StatsBar />
      <About />
      <Philosophy />
      <Curriculum />
      <MeetingFormat />
      <Roadmap />
      <TechStack />
      <Team />
      <JoinCTA />
      <Footer />
    </main>
  );
}
