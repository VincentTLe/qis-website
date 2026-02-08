"use client";

import { SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
        {/* Left: Logo + name */}
        <div className="flex items-center gap-2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 32 32"
            fill="none"
            className="shrink-0"
          >
            <rect
              x="1"
              y="1"
              width="30"
              height="30"
              rx="4"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-text-tertiary"
            />
            <text
              x="16"
              y="22"
              textAnchor="middle"
              fill="currentColor"
              className="text-text-tertiary"
              fontSize="18"
              fontWeight="700"
              fontFamily="var(--font-sans)"
            >
              Q
            </text>
          </svg>
          <span className="text-xs text-text-tertiary">
            {SITE_CONFIG.name} &middot; {SITE_CONFIG.school}
          </span>
        </div>

        {/* Center: Disclaimer */}
        <p className="max-w-md text-xs text-text-tertiary">
          Educational purposes only. Not investment advice.
        </p>

        {/* Right: Copyright */}
        <p className="text-xs text-text-tertiary">
          &copy; {SITE_CONFIG.established} {SITE_CONFIG.shortName}
        </p>
      </div>
    </footer>
  );
}
