"use client";

import { useEffect } from "react";

export default function ProjectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.classList.add("projector-mode");
    return () => document.body.classList.remove("projector-mode");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
