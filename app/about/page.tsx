import Image from "next/image";
import AboutHero from "./components/AboutHero";
import JourneySection from "./components/JourneySection";
import WhatIOffer from "./components/WhatIOffer";
import ApproachSection from "./components/ApproachSection";
import ExperienceList from "./components/ExperienceList";
import WhyIDoThis from "./components/WhyIDoThis";
import AboutFinalCTA from "./components/AboutFinalCTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Abharana Kakal",
  description:
    "A journey into yoga, sound healing, and inner awareness. Learn more about the path and offerings of Abharana Kakal.",
};

export default function AboutPage() {
  return (
    <main className="relative min-h-screen text-[#4a3b32] paper-grain  overflow-hidden">
      {/* Global Background Image */}
      <div className="fixed inset-0 z-[-2] pointer-events-none">
        <Image
          src="/other-page-bg.jpeg"
          alt="About Background"
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-[#f1e4da]/20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* Page Sections */}
      <AboutHero />
      
      <div className="relative z-10 w-full space-y-0">
        <JourneySection />
        <WhatIOffer />
        <ApproachSection />
        <ExperienceList />
        <WhyIDoThis />
        <AboutFinalCTA />
      </div>

      {/* Bottom Subtle Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-[#f1e4da]/80 to-transparent pointer-events-none z-[-1]" />
    </main>
  );
}
