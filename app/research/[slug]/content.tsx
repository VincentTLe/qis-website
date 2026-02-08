"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ResearchPost } from "@/data/research";

interface ResearchDetailContentProps {
  post: ResearchPost;
  related: ResearchPost[];
}

export function ResearchDetailContent({ post, related }: ResearchDetailContentProps) {
  return (
    <div className="px-6 pb-24 pt-32 md:pt-40">
      <div className="mx-auto max-w-3xl">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/research"
            className="mb-8 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            <ArrowLeft size={16} />
            Back to Research
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} color="blue">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="mb-6 text-3xl font-bold text-text-primary md:text-4xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 border-b border-border pb-8 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <User size={16} className="text-accent-blue" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-accent-blue" />
              <span className="font-mono">
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-accent-blue" />
              <span className="font-mono">{post.readTime}</span>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {post.content.split("\n\n").map((block, i) => {
            if (block.startsWith("## ")) {
              return (
                <h2
                  key={i}
                  className="mt-10 text-2xl font-bold text-text-primary"
                >
                  {block.replace("## ", "")}
                </h2>
              );
            }
            if (block.startsWith("### ")) {
              return (
                <h3
                  key={i}
                  className="mt-8 text-xl font-semibold text-text-primary"
                >
                  {block.replace("### ", "")}
                </h3>
              );
            }
            if (block.startsWith("- ")) {
              return (
                <ul key={i} className="space-y-2 pl-4">
                  {block.split("\n").map((line, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-base leading-relaxed text-text-secondary"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-blue" />
                      {line.replace(/^- /, "")}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="text-base leading-relaxed text-text-secondary">
                {block}
              </p>
            );
          })}
        </motion.article>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-border pt-12">
            <h2 className="mb-8 text-2xl font-bold text-text-primary">
              Related Research
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((rel) => (
                <Link key={rel.slug} href={`/research/${rel.slug}`}>
                  <Card className="h-full">
                    <h3 className="mb-2 text-sm font-semibold text-text-primary">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-text-tertiary line-clamp-2">
                      {rel.excerpt}
                    </p>
                    <p className="mt-3 font-mono text-xs text-text-tertiary">
                      {rel.readTime}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
