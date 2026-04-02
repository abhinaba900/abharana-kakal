import Image from "next/image";
import JournalHero from "./components/JournalHero";
import BlogGrid from "./components/BlogGrid";
import JournalCTA from "./components/JournalCTA";

export const metadata = {
  title: "Journal | Abharana Kakal",
  description:
    "Reflections on yoga, feminine energy, and inner awareness from Abharana Kakal. Stories, practices, and wisdom for the journey inward.",
};

export default function JournalPage() {
  return (
    <main className="relative min-h-screen text-[#4a3b32] paper-grain">
      {/* Background Image — same as retreats */}
      <div className="fixed inset-0 z-[-2]">
        <Image
          src="/wellness-practices-self-care-world-health-day.webp"
          alt="Soft nature background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#f1e4da]/20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <JournalHero />
      <BlogGrid />
      <JournalCTA />
    </main>
  );
}
