"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const experiences = [
  { id: "01", title: "BSc in Yoga", subtitle: "Traditional Gurukula System — Mysore, India" },
  { id: "02", title: "Masters in Yoga", subtitle: "Somatic Therapy & Philosophy — Bangalore, India" },
  { id: "03", title: "International Practice", subtitle: "Holistic Immersion — Ubud, Indonesia" },
  { id: "04", title: "Sacred Retreats", subtitle: "Lead Facilitator — Kandy, Sri Lanka" }
];

export default function ExperienceList() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section ref={containerRef} className="relative py-24 md:py-64 px-6 overflow-hidden bg-[#fffdf8] paper-grain">
      {/* Editorial Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] md:text-[25rem] font-serif text-[#bc6746]/5 pointer-events-none select-none z-0 tracking-widest">
        ARCHIVES
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1.2 }}
           className="text-center mb-32"
        >
          <span className="text-[#bc6746] font-mono text-xs uppercase tracking-[0.4em] mb-4 block">professional lineage</span>
          <h2 className="text-5xl md:text-8xl font-serif text-[#a55a3d] leading-none tracking-tighter">
            The <br />
            <span className="text-[#bc6746] italic font-light">Experience</span>
          </h2>
        </motion.div>

        <motion.div 
          style={{ y: textY }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-24 md:gap-y-32 w-full max-w-6xl"
        >
          {experiences.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: idx * 0.1 }}
              className="flex items-start gap-10 group relative"
            >
              {/* Vertical line indicator */}
              <div className="absolute -left-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#bc6746]/30 via-transparent to-transparent" />
              
              <div className="flex flex-col items-start pt-1">
                <span className="text-4xl md:text-5xl font-serif text-[#bc6746]/20 mb-4 group-hover:text-[#bc6746]/40 transition-colors">
                   {exp.id}
                </span>
                <h3 className="text-2xl md:text-3xl font-serif text-[#a55a3d] mb-3 group-hover:translate-x-2 transition-transform duration-500">
                  {exp.title}
                </h3>
                <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-[#4a3b32]/40 font-mono font-bold">
                  {exp.subtitle}
                </p>
                <div className="mt-6 w-0 group-hover:w-full h-px bg-[#bc6746]/20 transition-all duration-1000" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

