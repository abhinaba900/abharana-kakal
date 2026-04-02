"use client";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { type BlogPost } from "../data";

interface Props {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

const categoryColors: Record<string, string> = {
  Yoga: "#7a9e7e",
  "Sound Healing": "#8b7ab5",
  "Feminine Energy": "#c47a8a",
  Retreats: "#bc6746",
};

function BackArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

export default function JournalDetailClient({ post, relatedPosts }: Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const catColor = categoryColors[post.category] ?? "#bc6746";

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative h-screen flex flex-col items-center justify-end overflow-hidden"
      >
        {/* Parallax image */}
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1008]/85 via-[#1a1008]/40 to-transparent" />
        </motion.div>

        {/* Back link */}
        <div className="absolute top-[86px] left-6 md:left-12 z-20">
          <Link
            href="/journal"
            id="journal-detail-back"
            className="inline-flex items-center gap-2 text-[#f1e4da]/70 hover:text-[#f1e4da] text-xs uppercase tracking-widest transition-colors duration-300"
          >
            <BackArrow />
            Journal
          </Link>
        </div>

        {/* Content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center px-6 pb-16 max-w-3xl mx-auto"
        >
          {/* Category pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <span
              className="px-4 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold text-white/90"
              style={{ backgroundColor: catColor + "cc" }}
            >
              {post.category}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.2 }}
            className="font-serif text-4xl md:text-6xl text-[#FFFDF8] leading-tight tracking-wide mb-6 text-shadow-soft"
          >
            {post.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center justify-center gap-4 text-[#f1e4da]/60 text-xs uppercase tracking-widest"
          >
            <span>{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-[#bc6746]/60" />
            <span>{post.readTime}</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Article Body ─────────────────────────────── */}
      <section className="relative py-20 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Intro paragraph */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9 }}
          >
            {/* Decorative divider */}
            <div className="flex items-center gap-4 mb-12">
              <div className="flex-1 h-px bg-[#bc6746]/20" />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-40">
                <circle cx="12" cy="12" r="3" fill="#bc6746" />
                <circle cx="12" cy="4" r="1.5" fill="#bc6746" />
                <circle cx="12" cy="20" r="1.5" fill="#bc6746" />
                <circle cx="4" cy="12" r="1.5" fill="#bc6746" />
                <circle cx="20" cy="12" r="1.5" fill="#bc6746" />
              </svg>
              <div className="flex-1 h-px bg-[#bc6746]/20" />
            </div>

            <p className="text-xl md:text-2xl text-[#FFFDF8]/90 font-serif leading-relaxed italic mb-14">
              {post.content.intro}
            </p>
          </motion.div>

          {/* Content sections */}
          {post.content.sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
              className="mb-12"
            >
              <h2 className="font-serif text-2xl md:text-3xl text-[#f1e4da] mb-5 tracking-wide">
                {section.heading}
              </h2>
              <p className="text-[#f1e4da]/80 text-base md:text-lg leading-loose">
                {section.body}
              </p>
            </motion.div>
          ))}

          {/* Pull quote */}
          {post.content.pullQuote && (
            <motion.blockquote
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9 }}
              className="relative my-16 px-10 py-10 rounded-2xl overflow-hidden"
            >
              {/* Glass card */}
              <div className="absolute inset-0 bg-[#fffdf8]/8 backdrop-blur-md border border-[#fffdf8]/10 rounded-2xl" />
              {/* Terracotta accent */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                style={{ background: `linear-gradient(to bottom, ${catColor}, transparent)` }}
              />
              {/* Large quote mark */}
              <span
                className="absolute top-4 left-6 font-serif text-7xl leading-none opacity-15 select-none"
                style={{ color: catColor }}
              >
                &ldquo;
              </span>
              <p className="relative z-10 font-serif text-xl md:text-2xl text-[#FFFDF8]/95 italic leading-relaxed text-center">
                {post.content.pullQuote}
              </p>
            </motion.blockquote>
          )}

          {/* Closing paragraph */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <p className="text-[#f1e4da]/75 text-base md:text-lg leading-loose">
              {post.content.closing}
            </p>
          </motion.div>

          {/* End divider */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-6 mb-10"
          >
            <div className="flex-1 h-px bg-[#bc6746]/20" />
            <span className="text-[10px] uppercase tracking-widest text-[#f1e4da]/40">
              Abharana Kakal
            </span>
            <div className="flex-1 h-px bg-[#bc6746]/20" />
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              href="/retreats"
              id="journal-detail-cta-retreats"
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#bc6746] text-[#FFFDF8] uppercase tracking-widest text-xs font-semibold hover:bg-[#a55a3d] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#bc6746]/30 text-center"
            >
              Explore Retreats
            </Link>
            <Link
              href="/contact"
              id="journal-detail-cta-contact"
              className="w-full sm:w-auto px-8 py-3 rounded-full border border-[#FFFDF8]/25 text-[#f1e4da] uppercase tracking-widest text-xs font-semibold hover:bg-[#FFFDF8]/8 transition-all duration-300 hover:-translate-y-1 text-center"
            >
              Book a Session
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Related Posts ─────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="relative py-20 px-6">
          {/* Subtle separator */}
          <div className="max-w-2xl mx-auto mb-14 flex items-center gap-6">
            <div className="flex-1 h-px bg-[#fffdf8]/10" />
            <p className="text-[#f1e4da]/50 text-xs uppercase tracking-widest whitespace-nowrap">
              More from the Journal
            </p>
            <div className="flex-1 h-px bg-[#fffdf8]/10" />
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedPosts.map((related, i) => {
              const rColor = categoryColors[related.category] ?? "#bc6746";
              return (
                <motion.article
                  key={related.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  className="group"
                >
                  <Link href={`/journal/${related.slug}`} id={`journal-related-${related.slug}`}>
                    {/* Image */}
                    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-5 border border-white/8">
                      <Image
                        src={related.image}
                        alt={related.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1008]/50 to-transparent" />
                      {/* Category badge */}
                      <div
                        className="absolute top-3 left-3 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest text-white/90 font-semibold"
                        style={{ backgroundColor: rColor + "cc" }}
                      >
                        {related.category}
                      </div>
                    </div>

                    <div className="px-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[11px] text-[#f1e4da]/50 uppercase tracking-widest">
                          {related.date}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-[#bc6746]/40" />
                        <span className="text-[11px] text-[#f1e4da]/50 uppercase tracking-widest">
                          {related.readTime}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg md:text-xl text-[#FFFDF8] group-hover:text-[#f1e4da] transition-colors duration-300 leading-snug mb-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-[#f1e4da]/60 leading-relaxed line-clamp-2">
                        {related.excerpt}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-[#bc6746] text-xs uppercase tracking-widest font-medium">
                        <span>Read</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        >
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>

          {/* View all link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center mt-14"
          >
            <Link
              href="/journal"
              id="journal-detail-view-all"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-[#FFFDF8]/20 text-[#f1e4da]/70 hover:text-[#f1e4da] hover:border-[#FFFDF8]/40 uppercase tracking-widest text-xs font-medium transition-all duration-300 hover:-translate-y-0.5"
            >
              <span>View All Journal Entries</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </section>
      )}

      {/* ── Bottom spacer ─────────────────────────────── */}
      <div className="h-16" />
    </>
  );
}
