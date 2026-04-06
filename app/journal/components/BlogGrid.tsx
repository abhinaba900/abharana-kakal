"use client";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { type Category as StaticCategory } from "../data";
import { blogService } from "@/lib/api/client";
import { Loader2 } from "lucide-react";

const PER_PAGE = 6;

const categoryColors: Record<string, string> = {
  Yoga: "#7a9e7e",
  "Sound Healing": "#8b7ab5",
  "Feminine Energy": "#c47a8a",
  Retreats: "#bc6746",
  Wisdom: "#bc6746",
};

interface UnifiedPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  isDynamic?: boolean;
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function BlogGrid() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState(PER_PAGE);
  const [dynamicPosts, setDynamicPosts] = useState<UnifiedPost[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResonances = async () => {
      try {
        const [postsRes, catsRes] = await Promise.all([
          blogService.posts.list(),
          blogService.categories.list()
        ]);

        if (postsRes.data.success) {
          const transformed: UnifiedPost[] = postsRes.data.data.map((p: any) => ({
            slug: p.id,
            title: p.title,
            excerpt: p.content.length > 150 && p.content.startsWith('{') ? 'Exploring the depths of inner awareness through sacred practice...' : p.content.substring(0, 160) + '...',
            date: new Date(p.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            category: p.journal_categories?.name || 'Wisdom',
            image: p.image_url || '/journal-yoga.png',
            readTime: 'Read',
            isDynamic: true
          }));
          setDynamicPosts(transformed);
        }

        if (catsRes.data.success) {
          setCategories(catsRes.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch dynamic resonances:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResonances();
  }, []);

  const allPosts: UnifiedPost[] = dynamicPosts;

  const filtered =
    activeCategory === "All"
      ? allPosts
      : allPosts.filter((p) => p.category === activeCategory);

  const featured = filtered[0];
  const rest = filtered.slice(1, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const filterList = ["All", ...categories.map(c => c.name)];

  if (loading && dynamicPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#bc6746]/50" />
        <p className="text-xs font-bold uppercase tracking-widest text-[#a55a3d]/40">Unfolding the sacred archives...</p>
      </div>
    );
  }

  return (
    <section className="relative pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* ── Category Filters ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {filterList.map((cat) => (
            <button
              key={cat}
              id={`journal-filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => {
                setActiveCategory(cat);
                setVisibleCount(PER_PAGE);
              }}
              className={`px-5 py-2 rounded-full text-xs uppercase tracking-widest font-medium transition-all duration-300 border ${
                activeCategory === cat
                  ? "bg-[#bc6746] text-[#FFFDF8] border-[#bc6746] shadow-[0_4px_12px_rgba(188,103,70,0.35)]"
                  : "bg-transparent text-[#f1e4da] border-[#FFFDF8]/30 hover:border-[#bc6746]/60 hover:text-[#bc6746]"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* ── Featured Card ──────────────────────── */}
            {featured && (
              <Link
                href={`/journal/${featured.slug}`}
                id={`journal-featured-${featured.slug}`}
                className="group block mb-14"
              >
                <motion.article
                  initial={{ opacity: 0, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="relative w-full rounded-3xl overflow-hidden border border-white/10"
                >
                  {/* Hero image */}
                  <div className="relative w-full aspect-[16/7] md:aspect-[21/8]">
                    <Image
                      src={featured.image}
                      alt={featured.title}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                      className="object-cover transition-transform duration-[900ms] ease-in-out group-hover:scale-105"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1008]/80 via-[#1a1008]/25 to-transparent" />

                    {/* Content positioned at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                      {/* Category badge */}
                      <div
                        className="inline-block mb-4 px-4 py-1 rounded-full text-[10px] uppercase tracking-widest text-white/90 font-semibold"
                        style={{
                          backgroundColor: (categoryColors[featured.category] ?? "#bc6746") + "cc",
                        }}
                      >
                        {featured.category}
                      </div>

                      <h2 className="font-serif text-3xl md:text-5xl text-[#FFFDF8] leading-tight tracking-wide mb-4 max-w-2xl group-hover:text-[#f1e4da] transition-colors duration-300">
                        {featured.title}
                      </h2>

                      <p className="text-sm md:text-base text-[#f1e4da]/70 max-w-xl leading-relaxed mb-5 line-clamp-2 hidden md:block">
                        {featured.excerpt}
                      </p>

                      <div className="flex items-center gap-5">
                        <div className="flex items-center gap-3 text-[#f1e4da]/50 text-xs uppercase tracking-widest">
                          <span>{featured.date}</span>
                          <span className="w-1 h-1 rounded-full bg-[#bc6746]/60" />
                          <span>{featured.readTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#bc6746] text-xs uppercase tracking-widest font-semibold ml-auto">
                          <span>Read</span>
                          <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              </Link>
            )}

            {/* ── Blog Grid ──────────────────────────── */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {rest.map((post, i) => {
                  const catColor = categoryColors[post.category] ?? "#bc6746";
                  return (
                    <motion.article
                      key={post.slug}
                      initial={{ opacity: 0, y: 0 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.08 }}
                      className="group"
                    >
                      <Link href={`/journal/${post.slug}`} id={`journal-card-${post.slug}`}>
                        {/* Image */}
                        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-5 border border-white/10 shadow-sm">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1008]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          {/* Category pill on image */}
                          <div
                            className="absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest text-white/90 font-semibold"
                            style={{ backgroundColor: catColor + "cc" }}
                          >
                            {post.category}
                          </div>
                        </div>

                        {/* Card content */}
                        <div className="px-1">
                          <div className="flex items-center gap-4 mb-3">
                            <span className="text-[11px] text-[#f1e4da]/60 uppercase tracking-widest">
                              {post.date}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-[#bc6746]/40" />
                            <span className="text-[11px] text-[#f1e4da]/60 uppercase tracking-widest">
                              {post.readTime}
                            </span>
                          </div>
                          <h2 className="text-xl md:text-2xl font-serif text-[#FFFDF8] mb-3 transition-colors duration-300 group-hover:text-[#f1e4da] leading-snug">
                            {post.title}
                          </h2>
                          <p className="text-sm text-[#f1e4da]/70 leading-relaxed line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="mt-4 flex items-center gap-2 text-[#bc6746] text-xs uppercase tracking-widest font-medium">
                            <span>Read</span>
                            <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Load More */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-20"
          >
            <button
              id="journal-load-more"
              onClick={() => setVisibleCount((n) => n + PER_PAGE)}
              className="px-10 py-3 rounded-full border border-[#FFFDF8]/30 text-[#f1e4da] uppercase tracking-widest text-xs font-medium hover:bg-[#FFFDF8]/10 hover:-translate-y-1 transition-all duration-300"
            >
              Load More
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
