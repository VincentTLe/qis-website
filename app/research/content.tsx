"use client";

import { motion } from "framer-motion";
import { Clock, User } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { researchPosts } from "@/data/research";

export function ResearchContent() {
  const featured = researchPosts.find((p) => p.featured);
  const regular = researchPosts.filter((p) => !p.featured);

  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-6xl">
        {/* Featured Article */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Link href={`/research/${featured.slug}`}>
              <div className="glass-card rounded-xl p-8 transition-all duration-300 hover:border-border-hover hover:scale-[1.01] md:p-10">
                <div className="mb-4 flex items-center gap-3">
                  <Badge color="green">Featured</Badge>
                  <span className="font-mono text-xs text-text-tertiary">
                    {featured.readTime}
                  </span>
                </div>
                <h2 className="mb-3 text-2xl font-bold text-text-primary md:text-3xl">
                  {featured.title}
                </h2>
                <p className="mb-4 max-w-3xl text-base leading-relaxed text-text-secondary">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-text-tertiary">
                  <div className="flex items-center gap-1.5">
                    <User size={14} />
                    <span>{featured.author}</span>
                  </div>
                  <span className="font-mono">
                    {new Date(featured.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {featured.tags.map((tag) => (
                    <Badge key={tag} color="gray">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Regular Articles */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {regular.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link href={`/research/${post.slug}`}>
                <Card className="flex h-full flex-col">
                  <div className="mb-3 flex items-center gap-2 text-xs text-text-tertiary">
                    <Clock size={14} />
                    <span className="font-mono">{post.readTime}</span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-text-primary">
                    {post.title}
                  </h3>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-text-secondary line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 border-t border-border pt-4 text-xs text-text-tertiary">
                    <span>{post.author}</span>
                    <span className="font-mono">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <Badge key={tag} color="gray">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
