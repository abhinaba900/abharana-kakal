"use client";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

export default function JourneySection() {
  

  return (
    <section className="relative py-24 md:py-24 px-6 overflow-hidden bg-[#fffdf8] paper-grain">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-16 md:gap-32">
        {/* Left Side: Heritage Visual Anchor */}
        <div className="w-full md:w-1/2 relative group">
          <motion.div className="relative aspect-[3/4] md:aspect-[4/5] rounded-tr-[120px] md:rounded-tr-[240px] rounded-bl-[40px] md:rounded-bl-[80px] overflow-hidden shadow-[0_40px_100px_rgba(188,103,70,0.1)] z-10 border border-white/20">
            <Image
              src="/about.webp"
              alt="Heritage Journals"
              fill
              className="object-cover transition-transform duration-[4s] group-hover:scale-105"
            />
            {/* Inner atmospheric wash */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#bc6746]/10 to-transparent" />
          </motion.div>

          {/* Subtle watermark behind image */}
          <div className="absolute -top-10 -left-10 text-[6rem] font-serif text-[#bc6746]/5 pointer-events-none select-none z-0">
            ROOTS
          </div>
        </div>

        {/* Right Side: Floating Editorial Narrative */}
        <motion.div className="w-full md:w-1/2 flex flex-col items-start relative z-20 md:-ml-24">
          <div className="soft-glass p-8 md:p-16 rounded-[40px] md:rounded-[60px] shadow-2xl space-y-10 border border-white/40">
            <motion.div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-[#bc6746]" />
              <span className="font-handwriting text-2xl text-[#bc6746]">
                My Journey
              </span>
            </motion.div>

            <motion.p className="text-2xl md:text-3xl font-light text-[#4a3b32] leading-relaxed">
              My journey with yoga began as a personal exploration—seeking
              balance, clarity, and a deeper connection with myself.
            </motion.p>

            <motion.p className="text-lg md:text-xl font-light text-[#4a3b32]/80 leading-relaxed">
              Over time, the practice grew beyond the physical. It became a way
              to understand the body, the breath, and the mind more deeply. This
              path gradually led me to sound healing and holding space for
              others in a more intentional way. Today, my work is about creating
              a supportive space where people can slow down, reconnect, and
              experience their own journey inward.
            </motion.p>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              className="h-px bg-gradient-to-r from-[#bc6746]/30 to-transparent"
            />

            <p className="text-xl md:text-2xl font-handwriting text-[#bc6746] opacity-80 pt-4 cursor-default hover:opacity-100 transition-opacity">
              &ldquo;The practice is not something I do, but somewhere I
              go.&rdquo;
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

