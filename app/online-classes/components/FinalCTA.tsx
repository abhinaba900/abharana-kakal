"use client";

import { motion } from "motion/react";

export default function FinalCTA() {
  return (
    <section className="py-32 px-4 text-center bg-[#4a3b32] text-[#FFFDF8] relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        <h2 className="text-4xl md:text-6xl font-serif uppercase tracking-widest leading-tight mb-8">
          Begin your practice <br className="hidden md:block"/> gently today
        </h2>
        <p className="text-lg md:text-xl text-[#f1e4da]/70 font-light mb-12 max-w-2xl mx-auto">
          Reconnect with your inner stillness and flow from wherever you find yourself.
        </p>
        <button 
           onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
           className="px-12 py-5 rounded-full border border-white/30 hover:bg-white hover:text-[#4a3b32] uppercase tracking-[0.3em] text-xs font-bold transition-all"
        >
           Return to Top
        </button>
      </motion.div>
      
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full z-0 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full z-0 pointer-events-none"></div>
    </section>
  );
}
