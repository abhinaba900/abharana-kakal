"use client";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

const reasons = [
  {
    id: "01",
    label: "Full Presence",
    image: "/sh-presence.png",
    body: "Speakers flatten sound. In the room, vibrations travel through the floor and walls — your whole body becomes the instrument of receiving.",
    align: "left",
  },
  {
    id: "02",
    label: "Guided Space",
    image: "/sh-guided.png",
    body: "The practitioner holds the intention of the room. Something happens in a shared field of stillness that no recording can replicate.",
    align: "right",
  },
  {
    id: "03",
    label: "Time to Integrate",
    image: "/sh-integrate.png",
    body: "After every session, we sit in silence together. You leave slowly, intentionally — carrying calm into the rest of your day.",
    align: "left",
  },
];

export default function WhyInPersonSection() {
  const containerRef = useRef(null);
  
  return (
    <section ref={containerRef} className="relative py-32 px-6 flex flex-col items-center bg-[#fffdf8] paper-grain overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-[40rem] h-[40rem] bg-[#bc6746]/5 organic-blob blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[40rem] h-[40rem] bg-[#f1e4da]/40 organic-blob-alt blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-serif text-[#a55a3d] mb-4">
            Why Experience In Person
          </h2>
          <p className="text-[#bc6746] font-handwriting text-3xl md:text-4xl">
            something shifts when you are there
          </p>
        </motion.div>

        <div className="flex flex-col gap-40 md:gap-64">
          {reasons.map((r, idx) => (
            <Chapter key={idx} reason={r} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Chapter({ reason, index }: { reason: any; index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const isEven = index % 2 === 0;

  return (
    <div 
      ref={ref}
      className={`relative flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 md:gap-12`}
    >
      {/* Decorative Index Number */}
      <motion.span 
        style={{ opacity: 0.05 }}
        className={`absolute -top-16 ${isEven ? '-left-12' : '-right-12'} text-[12rem] md:text-[22rem] font-serif text-[#a55a3d] leading-none pointer-events-none select-none z-0`}
      >
        {reason.id}
      </motion.span>

      {/* Image Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full md:w-3/5 aspect-[4/3] md:aspect-[16/10] rounded-[50px] overflow-hidden shadow-2xl z-10"
      >
         <Image 
          src={reason.image} 
          alt={reason.label} 
          fill 
          className="object-cover transition-transform duration-[3s] hover:scale-105"
          priority={index === 0}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#4a3b32]/10 to-transparent" />
      </motion.div>

      {/* Text Content - The "Bubble" */}
      <motion.div 
        style={{ y }}
        initial={{ opacity: 0, x: isEven ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`relative z-20 w-[90%] md:w-2/5 p-10 md:p-16 soft-glass rounded-[80px_30px_90px_40px] flex flex-col justify-center items-start ${isEven ? 'md:-ml-16' : 'md:-mr-16'} -mt-20 md:mt-0`}
      >
        <span className="text-[#bc6746] font-handwriting text-2xl mb-4 opacity-80">
          {index === 0 ? "Presence" : index === 1 ? "Guided" : "Integration"}
        </span>
        <h3 className="text-3xl md:text-5xl font-serif text-[#a55a3d] mb-6 leading-tight">
          {reason.label}
        </h3>
        <p className="text-lg md:text-xl text-[#4a3b32]/90 leading-relaxed font-light">
          {reason.body}
        </p>
        
        {/* Subtle detail */}
        <div className="mt-10 w-16 h-px bg-[#bc6746]/40" />
      </motion.div>
    </div>
  );
}


