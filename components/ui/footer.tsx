"use client";

import Link from "next/link";
import { Mail, Github, Linkedin } from "lucide-react";
import { siteConfig, footerLinks } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <svg
                width="28"
                height="28"
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
                  className="text-text-secondary"
                />
                <text
                  x="16"
                  y="22"
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-text-primary"
                  fontSize="18"
                  fontWeight="700"
                  fontFamily="var(--font-sans)"
                >
                  Q
                </text>
              </svg>
              <span className="text-lg font-bold tracking-tight text-text-primary">
                {siteConfig.shortName}
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-secondary">
              {siteConfig.name} at {siteConfig.school}. {siteConfig.tagline}
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-text-tertiary transition-colors hover:text-text-primary"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-tertiary transition-colors hover:text-text-primary"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-tertiary transition-colors hover:text-text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Pages */}
          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.15em] text-text-tertiary">
              Pages
            </h3>
            <ul className="space-y-3">
              {footerLinks.pages.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.15em] text-text-tertiary">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("http") ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-text-tertiary">
            &copy; {siteConfig.established} {siteConfig.name}. Educational purposes only.
          </p>
          <p className="text-xs text-text-tertiary">
            {siteConfig.school} &middot; {siteConfig.location}
          </p>
        </div>
      </div>
    </footer>
  );
}
