import type { Metadata } from "next";
import { BeautyContestPageContent } from "./content";

export const metadata: Metadata = {
  title: "Keynesian Beauty Contest",
  description: "Quick multiplayer guessing game: pick a number from 0 to 100 and get closest to two-thirds of the room average.",
};

export default function BeautyContestPage() {
  return <BeautyContestPageContent />;
}