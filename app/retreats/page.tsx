import Image from "next/image";
import HeroSection from "./components/HeroSection";
import IntroSection from "./components/IntroSection";
import RetreatCards from "./components/RetreatCards";
import ExperienceSection from "./components/ExperienceSection";
import LocationsSection from "./components/LocationsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import GallerySection from "./components/GallerySection";
import FinalCTA from "./components/FinalCTA";

export default function RetreatsPage() {
  return (
    <main className="relative min-h-screen text-[#4a3b32] paper-grain pt-[70px]">
      {/* Global Background Image */}
      <div className="fixed inset-0 z-[-2]">
        <Image
          src="/wellness-practices-self-care-world-health-day.webp"
          alt="Organic Watercolor Background"
          fill
          priority
          className="object-cover"
        />
        {/* Soft global overlay to ensure readability */}
        <div className="absolute inset-0 bg-[#f1e4da]/20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <HeroSection />
      <IntroSection />
      <RetreatCards />
      <ExperienceSection />
      <LocationsSection />
      <TestimonialsSection />
      <GallerySection />
      <FinalCTA />
    </main>
  );
}
