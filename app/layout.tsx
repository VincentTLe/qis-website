import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "QIS — Quantitative Investment Society | Knox College",
  description:
    "Knox College's premier quantitative finance club. Learn algorithms, build trading systems, compete globally. Join the Beta.",
  openGraph: {
    title: "QIS — Quantitative Investment Society",
    description:
      "We Learn. We Build. We Compete. Join Knox College's quant finance Beta Launch.",
    url: "https://knoxqis.org",
    siteName: "QIS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QIS — Quantitative Investment Society | Knox College",
    description: "We Learn. We Build. We Compete.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-background font-sans antialiased">{children}</body>
    </html>
  );
}
