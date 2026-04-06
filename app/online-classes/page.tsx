"use client";

import BookingFlow from "./components/BookingFlow";
import TrustSection from "./components/TrustSection";
import { motion } from "framer-motion";

export default function OnlineClassesPage() {
  return (
    <main className="relative text-[#4a3b32] paper-grain pt-[70px] bg-[#fffdf8] md:overflow-hidden overflow-y-auto flex flex-col">
      {/* Premium Sanctuary Background */}
      <div className="fixed inset-0 z-[-2] pointer-events-none">
        <div className="absolute inset-0 bg-[#f1e4da]/40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-white/40"></div>
        
        {/* Animated Sanctuary Blobs */}
        <motion.div 
          className="absolute -top-1/4 -right-1/4 w-full h-full bg-[#bc6746]/5 rounded-full blur-[140px]"
        />
        <motion.div 
          className="absolute -bottom-1/4 -left-1/4 w-full h-full bg-[#a55a3d]/5 rounded-full blur-[160px]"
        />
      </div>

      {/* The main booking interface - Adaptive Layout */}
      <section id="book" className="px-4 relative z-10 flex flex-col pt-8 pb-32">
        <div className="max-w-7xl mx-auto w-full relative">
          <BookingFlow />
          
          {/* Internal Mobile Only Trust Section */}
          <div className="md:hidden mt-20">
             <TrustSection />
          </div>
        </div>
      </section>

      {/* Desktop Hidden Trust Section or Footer elements */}
      <div className="hidden md:block absolute bottom-4 left-0 w-full z-20 pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center opacity-40">
             <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#bc6746]">Sanctuary Direct Verification © 2024</p>
             <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#bc6746]">Premium Wellness Collective</p>
          </div>
      </div>

      {/* Subtle bottom decorative gradient */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#bc6746]/5 to-transparent pointer-events-none" />
    </main>
  );
}
