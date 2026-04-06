"use client";

import { motion } from "framer-motion";

const downloads = [
  {
    title: "Retreat Brochure 2025",
    description:
      "A comprehensive guide to our upcoming sacred gatherings and locations.",
    size: "2.4 MB",
    link: "#",
  },
  {
    title: "Daily Yoga Practice Guide",
    description:
      "A minimal sequence to help you maintain your practice at home.",
    size: "1.1 MB",
    link: "#",
  },
  {
    title: "Sound Healing Introduction",
    description:
      "Understanding the frequencies that heal and restore the nervous system.",
    size: "1.8 MB",
    link: "#",
  },
  {
    title: "Beginner's Guide to Pranayama",
    description:
      "Simple breathwork techniques for daily grounding and presence.",
    size: "0.9 MB",
    link: "#",
  },
];

export default function DownloadsPage() {
  return (
    <main className="min-h-screen bg-[#fffdf8] pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* HERO */}
        <motion.div className="mb-16 md:mb-24">
          <h1 className="text-4xl md:text-5xl font-light text-[#bc6746] mb-6 tracking-tight">
            Downloads
          </h1>
          <p className="text-[#a55a3d] text-lg md:text-xl font-light opacity-80 max-w-xl leading-relaxed">
            Resources to support your journey towards wholeness and presence.
          </p>
        </motion.div>

        {/* LIST */}
        <div className="space-y-4">
          {downloads.map((item, index) => (
            <motion.div
              key={item.title}
              className="group p-6 md:p-8 rounded-3xl bg-[#f1e4da]/30 border border-[#bc6746]/5 hover:bg-[#f1e4da]/50 hover:border-[#bc6746]/20 transition-all duration-500"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-medium text-[#bc6746]">
                    {item.title}
                  </h3>
                  <p className="text-[#a55a3d]/70 text-md md:text-xl leading-relaxed max-w-md italic">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t border-[#bc6746]/10 pt-4 md:border-0 md:pt-0">
                  <span className="text-[10px] tracking-widest uppercase text-[#a55a3d]/40 font-bold">
                    {item.size}
                  </span>
                  <button className="px-6 py-2 rounded-full border border-[#bc6746]/30 text-[#bc6746] text-xs font-bold tracking-widest uppercase hover:bg-[#bc6746] hover:text-white transition-all duration-300 active:scale-95 shadow-sm">
                    Download
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FOOTER NOTE */}
        <p className="mt-20 text-center text-[11px] tracking-[0.2em] uppercase text-[#a55a3d]/40">
          New resources added monthly
        </p>
      </div>
    </main>
  );
}
