"use client";
import { motion, useScroll, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { useRef } from "react";

// Dynamically import map to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("./MapComponent"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#f1e4da]/20 rounded-[40px] md:rounded-[60px] animate-pulse" />
});

export default function LocationsSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const mapY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const textY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <section ref={containerRef} className="relative py-24 md:py-64 px-6 overflow-hidden bg-[#fffdf8] paper-grain">
      {/* Decorative Background Accents */}
      <div className="absolute top-0 right-0 w-[60%] h-full bg-[#f1e4da]/10 organic-blob blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col md:flex-row items-center gap-16 md:gap-24">
        {/* Left Side: Editorial Context */}
        <motion.div 
          style={{ y: textY }}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full md:w-2/5 flex flex-col items-start"
        >
          <div className="flex items-center gap-4 mb-6 opacity-60">
            <div className="w-10 h-px bg-[#bc6746]" />
            <span className="font-handwriting text-2xl text-[#bc6746] tracking-wide">The Sanctuary Map</span>
          </div>

          <h2 className="text-4xl md:text-7xl font-serif text-[#a55a3d] leading-[1.05] mb-10 tracking-tight">
            Sacred <br />
            <span className="text-[#bc6746] italic font-light">Geographies</span>
          </h2>

          <p className="text-xl md:text-2xl font-light text-[#4a3b32] leading-relaxed max-w-md mb-12">
            Explore our curated network of spiritual nodes across Bangalore. From urban sanctuaries to quiet lakeside retreats, each location is chosen for its unique energetic resonance and ability to hold space for deep transformation.
          </p>

          <div className="flex flex-col gap-6">
             <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full border border-[#bc6746]/20 flex items-center justify-center text-[#bc6746] group-hover:bg-[#bc6746] group-hover:text-white transition-all duration-500">
                   <span className="text-xs font-serif">01</span>
                </div>
                <span className="uppercase tracking-widest text-[10px] font-semibold text-[#bc6746]/60">Studio Sessions</span>
             </div>
             <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full border border-[#bc6746]/20 flex items-center justify-center text-[#bc6746] group-hover:bg-[#bc6746] group-hover:text-white transition-all duration-500">
                   <span className="text-xs font-serif">02</span>
                </div>
                <span className="uppercase tracking-widest text-[10px] font-semibold text-[#bc6746]/60">Private Immersions</span>
             </div>
             <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full border border-[#bc6746]/20 flex items-center justify-center text-[#bc6746] group-hover:bg-[#bc6746] group-hover:text-white transition-all duration-500">
                   <span className="text-xs font-serif">03</span>
                </div>
                <span className="uppercase tracking-widest text-[10px] font-semibold text-[#bc6746]/60">Urban Retreats</span>
             </div>
          </div>
        </motion.div>

        {/* Right Side: Interactive Cartography */}
        <motion.div
          style={{ y: mapY }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full md:w-3/5 aspect-square md:aspect-[4/5] relative"
        >
          {/* Decorative shadowing for depth */}
          <div className="absolute -inset-4 bg-[#bc6746]/5 blur-[60px] rounded-[80px] pointer-events-none" />
          
          {/* The Actual Map */}
          <MapComponent />

          {/* Floating legend or accent */}
          <div className="absolute -bottom-10 -left-10 soft-glass p-8 rounded-[30px] hidden md:block shadow-2xl border-white/40 paper-grain z-10 max-w-[240px]">
             <span className="font-serif italic text-[#bc6746] text-xl mb-2 block">&quot;The map is but a doorway.&quot;</span>
             <p className="text-[10px] text-[#4a3b32]/60 leading-relaxed font-light">Find the space that resonates with your current path and let the healing begin.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

