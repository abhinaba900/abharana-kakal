"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import HeroSection from "./components/HeroSection";
import BookingFlow from "./components/BookingFlow";
import TrustSection from "./components/TrustSection";
import FinalCTA from "./components/FinalCTA";

export default function OnlineClassesPage() {
  return (
    <main className="relative min-h-screen text-[#4a3b32] paper-grain pt-[70px] overflow-x-hidden">
      {/* Global Background Image (consistent with retreats) */}
      <div className="fixed inset-0 z-[-2]">
        <Image
          src="/organic-yoga-watercolor.webp" // Reusing or using a similar organic asset
          alt="Organic Watercolor Background"
          fill
          priority
          className="object-cover opacity-80"
          onError={(e) => {
            // Fallback to retreats background if specific one not found
            (e.target as any).src = '/wellness-practices-self-care-world-health-day.webp';
          }}
        />
        <div className="absolute inset-0 bg-[#f1e4da]/40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-white/20"></div>
      </div>

      <HeroSection />
      
      {/* The main booking interface */}
      <section id="book" className="py-24 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <BookingFlow />
        </div>
      </section>

      <TrustSection />
      <FinalCTA />
    </main>
  );
}
