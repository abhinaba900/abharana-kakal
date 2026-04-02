"use client";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

const RETREATS = [
  {
    id: "01",
    name: "Awakening the Goddess",
    location: "Ubud, Bali",
    dates: "Oct 12 - 18, 2026",
    desc: "A journey through water, breath, and ancient feminine wisdom.",
    img: "/rt-bali.png",
    offset: "md:translate-y-0"
  },
  {
    id: "02",
    name: "Sacred Silence",
    location: "Rishikesh, India",
    dates: "Nov 5 - 12, 2026",
    desc: "Find your truth in the heart of the Himalayas.",
    img: "/rt-rishikesh.png",
    offset: "md:translate-y-24"
  },
  {
    id: "03",
    name: "Oceanic Reset",
    location: "Weligama, Sri Lanka",
    dates: "Dec 3 - 9, 2026",
    desc: "Purify mind and body with the rhythm of the waves.",
    img: "/rt-srilanka.png",
    offset: "md:translate-y-12"
  }
];

export default function RetreatCards() {
  const containerRef = useRef(null);

  return (
    <section ref={containerRef} className="relative py-24 md:py-24 px-6 z-10 w-full overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-br from-[#bc6746]/10 via-transparent to-[#a55a3d]/5 blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 0 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1.0, ease: "easeOut" }}
           className="text-center mb-32"
        >
          <span className="font-handwriting text-3xl text-[#f1e4da] mb-4 block opacity-80">Join us in Sacred Spaces</span>
          <h2 className="text-5xl md:text-7xl font-serif text-[#FFFDF8] uppercase tracking-widest text-shadow-soft">
            Upcoming Immersions
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 pb-32">
          {RETREATS.map((retreat, idx) => (
            <RetreatCard key={retreat.id} retreat={retreat} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RetreatCard({ retreat, index }: { retreat: any; index: number }) {
  const cardRef = useRef(null);
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`relative group ${retreat.offset} flex flex-col h-[650px] md:h-[750px] rounded-[50px] overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-[0_40px_100px_rgba(188,103,70,0.25)]`}
    >
      {/* Image Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
         <Image 
          src={retreat.img} 
          alt={retreat.name} 
          fill 
          className="object-cover scale-110 group-hover:scale-100 transition-transform duration-[4s] ease-out" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#4a3b32] via-[#4a3b32]/40 to-transparent mix-blend-multiply opacity-80"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent opacity-60"></div>
      </div>

      {/* Decorative Index Number */}
      <span className="absolute top-8 right-10 text-[10rem] font-serif text-[#FFFDF8]/5 leading-none pointer-events-none select-none z-10 transition-opacity duration-700 group-hover:opacity-10">
        {retreat.id}
      </span>
      
      {/* Content Wrapper */}
      <div className="relative z-20 flex flex-col h-full justify-between p-10 md:p-14 text-[#FFFDF8]">
        {/* Header Segment */}
        <div>
           <motion.p 
             initial={{ opacity: 0, x: 0 }}
             animate={{ opacity: 0.8, x: 0 }}
             transition={{ duration: 1.0, delay: 0.3 + index * 0.1 }}
             className="font-handwriting text-3xl text-[#f1e4da] mb-2"
           >
             {retreat.location}
           </motion.p>
           <h3 className="text-4xl md:text-5xl font-serif leading-[1.1] mb-2 tracking-tight group-hover:tracking-normal transition-all duration-700">
             {retreat.name}
           </h3>
           <p className="text-sm tracking-[0.3em] uppercase opacity-70 mb-4">{retreat.dates}</p>
        </div>

        {/* Footer Segment */}
        <div className="flex flex-col gap-8">
           <div className="w-16 h-px bg-[#bc6746]/50 transition-all duration-700 group-hover:w-full" />
           
           <p className="font-light text-lg md:text-xl italic text-[#f1e4da]/90 leading-relaxed max-w-[280px]">
             &quot;{retreat.desc}&quot;
           </p>

           <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.98 }}
             className="soft-glass self-start uppercase tracking-widest text-xs font-semibold py-4 px-10 rounded-full border border-white/20 hover:bg-[#bc6746] hover:border-[#bc6746] transition-all duration-500 shadow-xl"
           >
             Explore Retreat
           </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

