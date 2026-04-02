"use client";

import { motion } from "motion/react";
import { Sparkles, ShieldCheck, HeartPulse } from "lucide-react";

export default function TrustSection() {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Personalised Guidance",
      desc: "Tailored support for your unique energy level and goals."
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "All Levels Welcome",
      desc: "From beginners to seasoned practitioners, we meet you where you are."
    },
    {
      icon: <HeartPulse className="w-6 h-6" />,
      title: "Supportive Space",
      desc: "A calm, non-judgmental environment to nurture your well-being."
    }
  ];

  return (
    <section className="py-24 px-4 bg-[#f1e4da]/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto text-[#bc6746] shadow-sm">
                {f.icon}
              </div>
              <h3 className="text-xl font-serif text-[#4a3b32] uppercase tracking-wider">{f.title}</h3>
              <p className="text-sm text-[#6b584c] font-light leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
