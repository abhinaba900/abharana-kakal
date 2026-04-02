import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/app/journal/data";
import JournalDetailClient from "@/app/journal/components/JournalDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} | Journal | Abharana Kakal`,
    description: post.excerpt,
  };
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = blogPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 2);

  const relatedSlugs = new Set([slug, ...related.map((p) => p.slug)]);

  const fallbackRelated = blogPosts
    .filter((p) => !relatedSlugs.has(p.slug))
    .slice(0, 2 - related.length);

  const relatedPosts = [...related, ...fallbackRelated].slice(0, 2);

  return (
    <main className="relative min-h-screen text-[#4a3b32] paper-grain">
      {/* Background Image */}
      <div className="fixed inset-0 z-[-2]">
        <Image
          src="/wellness-practices-self-care-world-health-day.webp"
          alt="Soft nature background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#f1e4da]/20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <JournalDetailClient post={post} relatedPosts={relatedPosts} />
    </main>
  );
}
