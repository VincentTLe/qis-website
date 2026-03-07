import type { Metadata } from "next";
import { AdminContent } from "./content";

export const metadata: Metadata = {
  title: "The Heist — Admin",
  description: "Admin control panel for The Heist.",
};

export default function HeistAdminPage() {
  return <AdminContent />;
}
