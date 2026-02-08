import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ContactContent } from "./content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Quantitative Investment Society at Knox College.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        label="// CONTACT"
        heading="Get in Touch"
        subtext="Have a question about QIS? Interested in partnering or sponsoring? We'd love to hear from you."
      />
      <ContactContent />
    </>
  );
}
