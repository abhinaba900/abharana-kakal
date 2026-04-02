"use client";
import { motion } from "motion/react";

export default function TestimonialsSection() {
  const testimonials = [
    { quote: "It felt like coming home. A profound shedding of layers in the most gentle way.", author: "Elena, Spain", rotation: "-rotate-2" },
    { quote: "The space held here is magic. I found my voice, my center, and my breath again.", author: "Sarah, UK", rotation: "rotate-3 translate-y-8" },
    { quote: "Every detail was crafted with love. The food, the practices, the women. Life-changing.", author: "Priya, India", rotation: "-rotate-1" }
  ];

  return (
    <section className="relative py-32 px-6 flex flex-col items-center">
      <motion.h2 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-serif text-[#FFFDF8] text-center mb-20 text-shadow-soft"
      >
        Voices of the Coven
      </motion.h2>

      <div className="flex flex-col md:flex-row gap-8 md:gap-12 max-w-6xl w-full justify-center">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className={`bg-[#fffdf8] p-8 md:p-10 shadow-xl w-full max-w-sm flex flex-col justify-between ${t.rotation} paper-grain border border-black/5`}
          >
            {/* Tape detail at the top */}
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-16 h-4 bg-white/40 backdrop-blur-md rotate-1 shadow-sm"></div>
            
            <p className="font-handwriting text-2xl md:text-3xl text-[#4a3b32] leading-relaxed mb-8">
              &quot;{t.quote}&quot;
            </p>
            <p className="text-sm uppercase tracking-widest text-[#bc6746] font-medium">— {t.author}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
