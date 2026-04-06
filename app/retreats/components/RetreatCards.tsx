"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import BookingPortal from "@/app/components/BookingPortal";

export default function RetreatCards() {
  const [retreats, setRetreats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRetreat, setSelectedRetreat] = useState<any>(null);
  const [isPortalOpen, setIsPortalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/retreats");
        const json = await res.json();
        if (json.success) setRetreats(json.data);
      } catch (err) {
        console.error("Failed to load retreats", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleBookNow = (retreat: any) => {
    setSelectedRetreat({
        id: retreat.id,
        title: retreat.title,
        price: retreat.price,
        date: retreat.date,
        location: retreat.location
    });
    setIsPortalOpen(true);
  };

  return (
    <section id="explore-retreats" className="relative py-24 md:py-24 px-6 z-10 w-full overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-br from-[#bc6746]/10 via-transparent to-[#a55a3d]/5 blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1.2 }}
           className="text-center mb-32"
        >
          <span className="font-handwriting text-3xl text-[#f1e4da] mb-4 block opacity-80">Join us in Sacred Spaces</span>
          <h2 className="text-5xl md:text-7xl font-serif text-[#FFFDF8] uppercase tracking-widest text-shadow-soft">
            Upcoming Immersions
          </h2>
        </motion.div>

        {loading ? (
            <div className="text-center py-20 text-[#bc6746] italic font-light">Tuning into rhythms...</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 pb-32">
            {retreats.map((retreat, idx) => (
                <RetreatCard key={retreat.id} retreat={retreat} index={idx} onBook={() => handleBookNow(retreat)} />
            ))}
            </div>
        )}
      </div>

      <BookingPortal 
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
        type="retreat"
        itemData={selectedRetreat}
      />
    </section>
  );
}

function RetreatCard({ retreat, index, onBook }: { retreat: any; index: number; onBook: () => void }) {
  const cardRef = useRef(null);
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.0, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`relative group flex flex-col h-[650px] md:h-[750px] rounded-[50px] overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-[0_40px_100px_rgba(188,103,70,0.25)]`}
    >
      {/* Image Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
         <Image 
          src={retreat.image_urls?.[0] || "/RT-bali.png"} 
          alt={retreat.title} 
          fill 
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover scale-110 group-hover:scale-100 transition-transform duration-[4s] ease-out" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#4a3b32] via-[#4a3b32]/40 to-transparent mix-blend-multiply opacity-80"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent opacity-60"></div>
      </div>

      {/* Decorative Index Number */}
      <span className="absolute top-8 right-10 text-[10rem] font-serif text-[#FFFDF8]/5 leading-none pointer-events-none select-none z-10 transition-opacity duration-700 group-hover:opacity-10">
        0{index + 1}
      </span>
      
      {/* Content Wrapper */}
      <div className="relative z-20 flex flex-col h-full justify-between p-10 md:p-14 text-[#FFFDF8]">
        {/* Header Segment */}
        <div>
           <motion.p 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 0.8 }}
             viewport={{ once: true }}
             transition={{ duration: 1.0, delay: 0.3 + index * 0.1 }}
             className="font-handwriting text-3xl text-[#f1e4da] mb-2"
           >
             {retreat.location || "Sanctuary Venue"}
           </motion.p>
           <h3 className="text-4xl md:text-5xl font-serif leading-[1.1] mb-2 tracking-tight group-hover:tracking-normal transition-all duration-700">
             {retreat.title}
           </h3>
           <p className="text-sm tracking-[0.3em] uppercase opacity-70 mb-4">{new Date(retreat.date).toLocaleDateString()}</p>
        </div>

        {/* Footer Segment */}
        <div className="flex flex-col gap-8">
           
           <p className="font-light text-lg md:text-xl italic text-[#f1e4da]/90 leading-relaxed max-w-[280px] line-clamp-3">
             &quot;{retreat.description}&quot;
           </p>

           <div className="flex items-center justify-between mt-4">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest opacity-40">Immersion Fee</span>
                    <span className="text-2xl font-serif text-[#bc6746]">₹{retreat.price}</span>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onBook}
                    className="soft-glass self-end uppercase tracking-widest text-[10px] font-black py-4 px-10 rounded-full border border-white/20 hover:bg-[#bc6746] hover:border-[#bc6746] transition-all duration-500 shadow-xl"
                >
                    Book Now
                </motion.button>
           </div>
        </div>
      </div>
    </motion.div>
  );
}


