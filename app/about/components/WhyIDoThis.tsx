"use client";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

export default function WhyIDoThis() {
  const containerRef = useRef(null);

  return (
    <section
      ref={containerRef}
      className="relative py-24 md:py-24 px-6 overflow-hidden bg-[#fffdf8] paper-grain"
    >
      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col md:flex-row items-center gap-16 md:gap-32">
        {/* Left Side: Ethereal Visual Anchor */}
        <div className="w-full md:w-2/5 relative group">
          <motion.div className="relative aspect-[4/5] rounded-t-[120px] rounded-br-[40px] rounded-bl-[120px] overflow-hidden shadow-2xl z-10 border border-white/20">
            <Image
              src="/about2.webp"
              alt="Sacred Space"
              fill
              className="object-cover transition-transform duration-[6s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#bc6746]/20 to-transparent mix-blend-overlay" />
          </motion.div>

          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#bc6746]/10 rounded-full blur-[80px] z-0" />
        </div>

        {/* Right Side: Deep Reflective Narrative */}
        <motion.div className="w-full md:w-3/5 flex flex-col items-start relative z-20">
          <div className="space-y-12">
            <motion.div className="flex items-center gap-6">
              <div className="w-12 h-px bg-[#bc6746]" />
              <span className="font-handwriting text-3xl text-[#bc6746]">
                Why I Do This
              </span>
            </motion.div>

            <motion.h2 className="text-4xl md:text-7xl font-serif text-[#a55a3d] leading-none tracking-tighter">
              The Calling of <br />
              <span className="text-[#bc6746] italic font-light">Presence</span>
            </motion.h2>

            <div className="max-w-xl space-y-10 group">
              <motion.p className="text-2xl md:text-4xl font-light text-[#4a3b32] leading-relaxed italic border-l-4 border-[#bc6746]/10 pl-8 group-hover:border-[#bc6746]/30 transition-all duration-700">
                &ldquo;I believe that real support comes from being
                present.&rdquo;
              </motion.p>

              <motion.p className="text-xl md:text-2xl font-light text-[#4a3b32]/70 leading-relaxed">
                In my sessions, I focus on creating a calm and safe space where
                you can connect with yourself more deeply. There is no pressure
                to perform or achieve—just an opportunity to experience,
                observe, and grow in your own way.
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
