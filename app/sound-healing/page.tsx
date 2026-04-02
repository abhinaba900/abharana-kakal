import Image from "next/image";
import HeroSection from "./components/HeroSection";
import IntroSection from "./components/IntroSection";
import AudioLibrary from "./components/AudioLibrary";
import SessionsSection from "./components/SessionsSection";
import WhyInPersonSection from "./components/WhyInPersonSection";
import TestimonialsSection from "./components/TestimonialsSection";
import FinalCTA from "./components/FinalCTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sound Healing & Guided Meditation | Abharana Kakal",
  description:
    "Experience live sound healing sessions in Bangalore & Mysore — Tibetan bowls, crystal bowls, gong baths, and guided meditation with Abharana Kakal.",
};

export default function SoundHealingPage() {
  return (
    <main className="relative min-h-screen text-[#4a3b32] paper-grain pt-[70px]">
      {/* Global Background Image — same as retreats page */}
      <div className="fixed inset-0 z-[-2]">
        <Image
          src="/tibetan-singing-bowl.webp"
          alt="Sound Healing Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#f1e4da]/20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <HeroSection />
      <IntroSection />
      <AudioLibrary />
      <SessionsSection />
      <WhyInPersonSection />
      <TestimonialsSection />
      <FinalCTA />
    </main>
  );
}
