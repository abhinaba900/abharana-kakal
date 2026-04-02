"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function GallerySection() {
  const images = [
    "/IMG_4266.webp",
    "/IMG_9334.webp",
    "/DSC00279.webp",
    "/IMG_1364.webp",
  ];

  return (
    <section className="relative py-24 px-6 bg-[#f1e4da]/70 border-t border-[#bc6746]/10">
      <motion.div
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8 }}
         className="text-center mb-16"
      >
        <p className="font-handwriting text-4xl text-[#bc6746] mb-2">glimpses of</p>
        <h2 className="text-4xl font-serif text-[#a55a3d]">The Journey</h2>
      </motion.div>

      <div className="max-w-6xl mx-auto columns-1 sm:columns-2 gap-6 space-y-6">
        {images.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className={`relative w-full rounded-[30px] overflow-hidden shadow-lg border border-white/40 group break-inside-avoid ${i % 2 === 0 ? "h-64" : "h-96"}`}
          >
            <Image 
              src={src} 
              alt="Gallery image" 
              fill 
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition-transform duration-1000 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-[#bc6746]/10 mix-blend-color transition-opacity group-hover:opacity-0"></div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

