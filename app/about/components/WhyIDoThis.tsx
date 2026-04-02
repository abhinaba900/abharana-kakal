"use client";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

export default function WhyIDoThis() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const imgY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section ref={containerRef} className="relative py-24 md:py-64 px-6 overflow-hidden bg-[#fffdf8] paper-grain">
      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col md:flex-row items-center gap-16 md:gap-32">
        
        {/* Left Side: Ethereal Visual Anchor */}
        <div className="w-full md:w-2/5 relative group">
          <motion.div 
            style={{ y: imgY }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] rounded-t-[120px] rounded-br-[40px] rounded-bl-[120px] overflow-hidden shadow-2xl z-10 border border-white/20"
          >
            <Image 
              src="/sh-intro-vessels.png" 
              alt="Sacred Space" 
              fill 
              className="object-cover transition-transform duration-[6s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#bc6746]/20 to-transparent mix-blend-overlay" />
          </motion.div>
          
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#bc6746]/10 rounded-full blur-[80px] z-0" />
        </div>

        {/* Right Side: Deep Reflective Narrative */}
        <motion.div 
          style={{ y: textY }}
          className="w-full md:w-3/5 flex flex-col items-start relative z-20"
        >
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-6"
            >
               <div className="w-12 h-px bg-[#bc6746]" />
               <span className="font-handwriting text-3xl text-[#bc6746]">Why I Do This</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-7xl font-serif text-[#a55a3d] leading-none tracking-tighter"
            >
              The Calling of <br />
              <span className="text-[#bc6746] italic font-light">Presence</span>
            </motion.h2>

            <div className="max-w-xl space-y-10 group">
              <motion.p 
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.4 }}
                className="text-2xl md:text-4xl font-light text-[#4a3b32] leading-relaxed italic border-l-4 border-[#bc6746]/10 pl-8 group-hover:border-[#bc6746]/30 transition-all duration-700"
              >
                &ldquo;Supporting others is not an action, but a way of being with them.&rdquo;
              </motion.p>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-xl md:text-2xl font-light text-[#4a3b32]/70 leading-relaxed"
              >
                Holding space is about creating a container of deep safety. It is a way of supporting another’s transformation without trying to control it—witnessing their journey with compassion and silence.
              </motion.p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
