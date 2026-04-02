"use client";

import BookingFlow from "./components/BookingFlow";
import TrustSection from "./components/TrustSection";
import { motion } from "framer-motion";

export default function OnlineClassesPage() {
  return (
    <main className="relative min-h-screen text-[#4a3b32] paper-grain pt-[70px] overflow-x-hidden bg-[#fffdf8]">
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

      
      {/* The main booking interface */}
      <section id="book" className="py-24 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <BookingFlow />
        </div>
      </section>

      <div className="relative z-10">
        <TrustSection />
      </div>

      {/* Subtle bottom decorative gradient */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#bc6746]/5 to-transparent pointer-events-none" />
    </main>
  );
}
