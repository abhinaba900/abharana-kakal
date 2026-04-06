"use client";
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
      <div
        
         className="text-center mb-16"
      >
        <p className="font-handwriting text-4xl text-[#bc6746] mb-2">glimpses of</p>
        <h2 className="text-4xl font-serif text-[#a55a3d]">The Journey</h2>
      </div>

      <div className="max-w-6xl mx-auto columns-1 sm:columns-2 gap-6 space-y-6">
        {images.map((src, i) => (
          <div
            key={i}
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
          </div>
        ))}
      </div>
    </section>
  );
}

