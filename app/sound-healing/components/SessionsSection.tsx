"use client";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

const sessions = [
  {
    id: "session-1",
    name: "Crystal Bowl Sound Bath",
    location: "Mysore",
    date: "12 APRIL 2025",
    day: "SATURDAY",
    time: "7:00 – 8:30 AM",
    description: "An early-morning immersion in crystal bowl harmonics. Lie down, close your eyes, and let sound do the rest.",
    spotsLeft: 4,
    img: "/other-page-bg.jpeg",
    accent: "#e2b9a7",
  },
  {
    id: "session-2",
    name: "Tibetan Bowl Journey",
    location: "Bangalore",
    date: "20 APRIL 2025",
    day: "SUNDAY",
    time: "6:30 – 8:00 PM",
    description: "Traditional Tibetan singing bowls played live, creating deep resonance that quiets the mind and grounds the body.",
    spotsLeft: 6,
    img: "/other-page-bg.jpeg",
    accent: "#bc6746",
  },
  {
    id: "session-3",
    name: "Nidra & Gong Bath",
    location: "Mysore",
    date: "26 APRIL 2025",
    day: "SATURDAY",
    time: "7:30 – 9:00 PM",
    description: "Yoga Nidra followed by a full gong bath — for complete rest and deep nervous system reset.",
    spotsLeft: 3,
    img: "/other-page-bg.jpeg",
    accent: "#a55a3d",
  },
];

function SessionCard({ session, idx }: { session: any; idx: number }) {
  const cardRef = useRef(null);
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, delay: idx * 0.15, ease: [0.215, 0.61, 0.355, 1] }}
      className={`relative group ${idx === 1 ? "md:mt-12" : ""}`}
    >
      {/* Background Shadow Blob / Layer */}
      <motion.div
        animate={{ 
          rotate: [0, 5, 0],
          scale: [1, 1.02, 1]
        }}
        transition={{ duration: 10 + idx, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 -m-4 bg-[#f1e4da]/40 rounded-[60px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
      />

      <div className="relative bg-[#fffdf8] border border-[#f1e4da]/50 rounded-[48px] overflow-hidden transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(188,103,70,0.12)] flex flex-col h-full">
        {/* Image Module with Floating Date */}
        <div className="relative h-64 overflow-hidden">
          <Image 
            src={session.img} 
            alt={session.name} 
            fill 
            className="object-cover transition-transform duration-1000 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
          
          {/* Floating Date Badge */}
          <div className="absolute top-6 left-6 z-20 flex flex-col items-center bg-[#fffdf8]/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-white/20">
            <span className="text-[#a55a3d] font-mono text-xs tracking-tighter leading-none mb-1 opacity-60">
              {session.day.slice(0, 3)}
            </span>
            <span className="text-[#a55a3d] font-serif text-2xl leading-none">
              {session.date.split(" ")[0]}
            </span>
            <span className="text-[#a55a3d] font-mono text-[10px] tracking-widest uppercase mt-1">
              {session.date.split(" ")[1]}
            </span>
          </div>

          {/* Availability Pulse */}
          <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 bg-[#4a3b32]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#bc6746] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#bc6746]"></span>
            </span>
            <span className="text-[#FFFDF8] text-[9px] font-mono tracking-widest uppercase">
              {session.spotsLeft} Available
            </span>
          </div>
        </div>

        {/* Content Module */}
        <div className="p-8 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
             <span className="font-handwriting text-[#bc6746] text-xl">{session.location}</span>
             <span className="text-[#4a3b32]/40 font-mono text-[10px] tracking-widest">{session.time}</span>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-serif text-[#4a3b32] mb-4 leading-tight group-hover:text-[#bc6746] transition-colors duration-500">
            {session.name}
          </h3>
          
          <p className="text-[#4a3b32]/60 text-sm leading-relaxed mb-8 font-light line-clamp-3 italic">
            &ldquo;{session.description}&rdquo;
          </p>

          <div className="mt-auto flex flex-col gap-3">
             <div className="h-[1px] w-full bg-[#f1e4da] mb-4" />
             <div className="flex gap-4">
               <a
                 href="/contact"
                 className="flex-1 text-center py-4 rounded-2xl bg-[#bc6746] text-[#FFFDF8] text-[10px] font-mono uppercase tracking-[.2em] hover:bg-[#a55a3d] transition-all transform hover:-translate-y-1 active:translate-y-0"
               >
                 Register Spot
               </a>
               <a
                 href="/contact"
                 className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl border border-[#bc6746]/30 text-[#bc6746] hover:bg-[#f1e4da]/30 transition-all"
                 aria-label="Enquire"
               >
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                 </svg>
               </a>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SessionsSection() {
  return (
    <section id="sh-sessions" className="relative py-32 px-6 z-10 w-full bg-[#fffdf8]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="text-[#bc6746] font-mono text-xs uppercase tracking-[.3em] mb-4 block">the circle of gathering</span>
          <h2 className="text-5xl md:text-6xl font-serif text-[#a55a3d] mb-6">Upcoming Sessions</h2>
          <p className="max-w-2xl mx-auto text-[#4a3b32]/60 text-lg font-light">
            Intentional spaces for deep restoration, held across the peaceful landscapes of Bangalore and Mysore.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 pb-20">
          {sessions.map((session, idx) => (
            <SessionCard key={session.id} session={session} idx={idx} />
          ))}
        </div>

        {/* Bottom Decorative Line */}
        <div className="flex justify-center mt-20">
           <motion.div 
             initial={{ width: 0 }}
             whileInView={{ width: "200px" }}
             viewport={{ once: true }}
             className="h-[1px] bg-gradient-to-r from-transparent via-[#bc6746]/30 to-transparent"
           />
        </div>
      </div>
    </section>
  );
}

