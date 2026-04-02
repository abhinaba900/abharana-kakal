"use client";

import { motion } from "framer-motion";

export default function FinalCTA() {
  return (
    <section className="py-24 px-4 text-center bg-[#fffdf8] relative overflow-hidden">
      <div className="absolute inset-0 bg-[#f1e4da]/10 mix-blend-multiply pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        <span className="text-[10px] uppercase tracking-[0.6em] text-[#a55a3d] font-black mb-8 block">
          Your journey begins here
        </span>
        <h2 className="text-5xl md:text-8xl font-serif text-[#4a3b32] uppercase tracking-tighter leading-[0.9] mb-12 italic">
          Begin your <br className="hidden md:block"/> practice <br className="hidden md:block"/> gently today
        </h2>
        <p className="text-lg md:text-xl text-[#4a3b32]/60 font-light mb-16 max-w-2xl mx-auto tracking-wide italic">
          Reconnect with your inner stillness and flow from <br className="hidden md:block"/> wherever you find yourself.
        </p>
        <button 
           onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
           className="px-16 py-6 rounded-full bg-[#bc6746] text-white uppercase tracking-[0.4em] text-[10px] font-black transition-all hover:bg-[#a55a3d] shadow-2xl shadow-[#bc6746]/30"
        >
           Return to Sanctuary
        </button>
      </motion.div>
      
      {/* Decorative Brand Accent */}
      <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-[#bc6746]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-[#bc6746]/5 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
}
