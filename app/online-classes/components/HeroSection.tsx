"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative h-[60vh] flex flex-col items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-[#bc6746] font-semibold mb-4 block">
          Practice from wherever you are
        </span>
        <h1 className="text-5xl md:text-7xl font-serif text-[#4a3b32] uppercase tracking-widest text-shadow-soft mb-6">
          Online Yoga <br className="hidden md:block"/> Sessions
        </h1>
        <p className="text-lg md:text-xl text-[#6b584c] font-light max-w-2xl mx-auto mb-10">
          Guided support for your home practice, tailored to your unique journey and energy level.
        </p>
        
        <button 
          onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-10 py-4 rounded-full bg-[#bc6746] text-[#FFFDF8] uppercase tracking-widest text-sm font-medium hover:-translate-y-1 transition-transform shadow-[0_4px_15px_rgba(188,103,70,0.3)]"
        >
          Book a Session
        </button>
      </motion.div>

      {/* Subtle organic background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {mounted && [...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#bc6746]/5 blur-xl"
            style={{
              width: Math.random() * 200 + 100 + "px",
              height: Math.random() * 200 + 100 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
            animate={{
              y: [0, -40, 0],
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </section>
  );
}
