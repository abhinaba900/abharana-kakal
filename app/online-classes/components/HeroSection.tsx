"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative h-[70vh] flex flex-col items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-[#a55a3d] font-bold mb-6 block">
          Practice from wherever you are
        </span>
        <h1 className="text-5xl md:text-8xl font-serif text-[#4a3b32] uppercase tracking-tighter leading-[0.9] mb-8">
          The Virtual <br className="hidden md:block"/> Sanctuary
        </h1>
        <p className="text-lg md:text-xl text-[#4a3b32]/70 font-light max-w-2xl mx-auto mb-12 italic">
          Guided support for your home practice, tailored to your unique journey and energy level.
        </p>
        
        <button 
          onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-12 py-5 rounded-full bg-[#bc6746] text-white uppercase tracking-[0.2em] text-xs font-bold hover:-translate-y-1 transition-all shadow-xl shadow-[#bc6746]/20"
        >
          Begin Your Journey
        </button>
      </motion.div>

      {/* Subtle organic background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {mounted && [...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#bc6746]/5 blur-[120px]"
            style={{
              width: Math.random() * 300 + 200 + "px",
              height: Math.random() * 300 + 200 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
            animate={{
              y: [0, -60, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </section>
  );
}
