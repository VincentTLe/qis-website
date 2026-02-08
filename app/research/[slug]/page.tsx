import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { researchPosts, getResearchBySlug, getRelatedPosts } from "@/data/research";
import { ResearchDetailContent } from "./content";

export function generateStaticParams() {
  return researchPosts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getResearchBySlug(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} | Research`,
    description: post.excerpt,
  };
}

export default function ResearchDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getResearchBySlug(params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(params.slug, 3);

  return <ResearchDetailContent post={post} related={related} />;
}
