"use client";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

export default function ContactHero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const imgY = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return (
    <section ref={containerRef} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden px-6 pt-20">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/other-page-bg.jpeg" 
          alt="Contact Sanctuary" 
          fill 
          className="object-cover opacity-50 contrast-[0.9]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f1e4da]/40 via-transparent to-[#fffdf8]" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col md:flex-row items-center gap-16 md:gap-32">
        {/* Left Side: Floating Editorial Heading */}
        <motion.div 
          style={{ y, opacity }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="w-full md:w-1/2 flex flex-col items-start relative z-10"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-[#bc6746]" />
            <span className="font-handwriting text-3xl text-[#bc6746]">A sacred invitation</span>
          </div>
          <h1 className="text-7xl md:text-[10rem] font-serif text-[#a55a3d] leading-[0.85] tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-[#a55a3d] to-[#bc6746]">
            Get in <br />
            <span className="italic font-light text-[#bc6746]">Touch</span>
          </h1>
          <div className="soft-glass p-6 md:p-8 rounded-[40px] border border-white/20 shadow-xl backdrop-blur-md">
            <p className="text-xl md:text-2xl font-light text-[#4a3b32] leading-relaxed italic opacity-80">
              If you feel called, you’re welcome to reach out.
            </p>
          </div>
        </motion.div>

        {/* Right Side: Mood Anchor Image */}
        <div className="w-full md:w-1/2 relative">
          <motion.div 
            style={{ y: imgY }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
            className="relative aspect-[3/4] md:aspect-[4/5] rounded-[120px] rounded-bl-[40px] overflow-hidden shadow-[0_50px_120px_rgba(188,103,70,0.15)] z-0 border border-white/40"
          >
            <Image 
              src="/sh-presence.png" 
              alt="Sacred Presence" 
              fill 
              className="object-cover"
              priority
            />
            {/* Inner atmospheric wash */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#bc6746]/10 to-transparent mix-blend-soft-light" />
          </motion.div>
          
          {/* Breathing aura element */}
          <motion.div 
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-20 -right-20 w-[30rem] h-[30rem] bg-[#bc6746]/10 rounded-full blur-[120px] z-[-1]" 
          />
        </div>
      </div>

      {/* Dynamic Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
        <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#bc6746]/60">Explore more</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#bc6746]/60 to-transparent" />
      </div>
    </section>
  );
}

