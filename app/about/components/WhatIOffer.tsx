"use client";
import { motion } from "motion/react";
import { HandHeart, Waves, Sparkles, Flower2 } from "lucide-react";

const offerings = [
  { 
    id: "yoga",
    icon: <HandHeart strokeWidth={1} size={32} />, 
    title: "Yoga", 
    benefit: "Rhythmic Restoration",
    desc: "Personal and group sessions focused on restorative medicine and somatic release.",
    texture: "radial-gradient(circle at 10% 20%, #e2b9a7 0%, transparent 40%)",
  },
  { 
    id: "sound",
    icon: <Sparkles strokeWidth={1} size={32} />, 
    title: "Sound Healing", 
    benefit: "Cellular Resonance",
    desc: "Vibrational medicine using Tibetan singing bowls and crystal harmonics to quiets the mind.",
    texture: "radial-gradient(circle at 90% 80%, #bc6746 0%, transparent 45%)",
  },
  { 
    id: "retreats",
    icon: <Waves strokeWidth={1} size={32} />, 
    title: "Retreats", 
    benefit: "Sacred Immersion",
    desc: "Immersive experiences across India, Sri Lanka, and Indonesia for deep soulful rest.",
    texture: "radial-gradient(circle at 10% 80%, #a55a3d 0%, transparent 40%)",
  },
  { 
    id: "feminine",
    icon: <Flower2 strokeWidth={1} size={32} />, 
    title: "Feminine Awakening", 
    benefit: "Innate Embodiment",
    desc: "Sacred circles and workshops for reconnecting with the ancestral feminine essence.",
    texture: "radial-gradient(circle at 90% 20%, #f1e4da 0%, transparent 50%)",
  }
];

export default function WhatIOffer() {
  return (
    <section className="relative py-24 md:py-24 px-6 overflow-hidden bg-[#fffdf8] paper-grain">
      {/* Large background watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] md:text-[30rem] font-serif text-[#bc6746]/5 pointer-events-none select-none z-0">
        PILLARS
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1.2 }}
           className="text-center mb-32"
        >
          <span className="text-[#bc6746] font-mono text-xs uppercase tracking-[0.4em] mb-4 block">the nature of my work</span>
          <h2 className="text-5xl md:text-8xl font-serif text-[#a55a3d] leading-none tracking-tighter">
            What I <br />
            <span className="text-[#bc6746] italic font-light">Offer</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-16 md:gap-y-24">
          {offerings.map((offer, idx) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: idx * 0.15 }}
              className="relative group cursor-default"
            >
              {/* Textured Background Glow */}
              <div 
                className="absolute inset-0 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-700 rounded-[60px]"
                style={{ background: offer.texture }}
              />
              
              <div className="relative z-10 bg-[#fffdf8]/60 backdrop-blur-sm border border-[#f1e4da]/60 p-10 md:p-14 rounded-[60px] shadow-sm group-hover:shadow-2xl group-hover:border-[#bc6746]/20 transition-all duration-700">
                <div className="flex flex-col items-start gap-10">
                  <div className="w-20 h-20 rounded-full bg-[#f1e4da]/40 flex items-center justify-center text-[#bc6746] group-hover:bg-[#bc6746] group-hover:text-white transition-all duration-700">
                    {offer.icon}
                  </div>
                  
                  <div className="flex-1">
                    <span className="text-[#bc6746] font-mono text-[10px] uppercase tracking-[0.3em] font-bold block mb-2">
                       {offer.benefit}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-serif text-[#a55a3d] mb-6 group-hover:text-[#bc6746] transition-colors">
                      {offer.title}
                    </h3>
                    <p className="text-lg md:text-xl font-light text-[#4a3b32]/70 leading-relaxed italic border-l-2 border-[#bc6746]/10 pl-8">
                      {offer.desc}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

