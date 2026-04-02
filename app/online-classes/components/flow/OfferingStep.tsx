"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { Clock, Sparkles } from "lucide-react";
import { Offering } from "./types";

interface OfferingCardProps {
  offering: Offering;
  isSelected: boolean;
  onSelect: (offering: Offering) => void;
  index: number;
}

const OfferingCard = memo(function OfferingCard({ offering, isSelected, onSelect, index }: OfferingCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onClick={() => onSelect(offering)}
      className={`group p-10 rounded-[40px] border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-full
        ${isSelected 
          ? 'border-[#bc6746] bg-white shadow-2xl shadow-[#bc6746]/10' 
          : 'border-[#f1e4da] bg-white/40 hover:bg-white/80 hover:border-[#bc6746]/20'}`}
      style={{ scale: isSelected ? 1.02 : 1 }}
    >
      <div>
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-serif text-[#4a3b32] uppercase tracking-wide">{offering.title}</h3>
          {isSelected && <Sparkles className="w-5 h-5 text-[#bc6746] animate-pulse" />}
        </div>
        <p className="text-sm text-[#4a3b32]/60 font-light leading-relaxed mb-10 tracking-wide italic">{offering.description}</p>
      </div>
      <div className="flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-[#bc6746]">
        <Clock className="w-3 h-3 mr-2" /> {offering.duration}
        <span className="mx-6 text-[#bc6746]/20 font-light">|</span>
        <span>From ₹{offering.single_price}</span>
      </div>
    </motion.div>
  );
});

interface OfferingStepProps {
  offerings: Offering[];
  selectedOffering: Offering | null;
  onSelect: (offering: Offering) => void;
}

const OfferingStep = memo(function OfferingStep({ offerings, selectedOffering, onSelect }: OfferingStepProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
      {offerings.map((offering, idx) => (
        <OfferingCard 
          key={offering.id} 
          offering={offering} 
          isSelected={selectedOffering?.id === offering.id} 
          onSelect={onSelect}
          index={idx}
        />
      ))}
    </div>
  );
});

export default OfferingStep;
