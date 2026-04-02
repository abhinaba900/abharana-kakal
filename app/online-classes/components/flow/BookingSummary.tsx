"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { User, Mail, Heart, Loader2, ChevronRight, CreditCard } from "lucide-react";
import { Offering, Session, UserData } from "./types";

interface BookingSummaryProps {
  intent: "group" | "private";
  selectedOffering: Offering | null;
  selectedSession: Session | null;
  bookingMode: "single" | "package";
  packageSize: number;
  calculateTotal: () => number;
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  isSubmitting: boolean;
  onFinalize: () => void;
}

const BookingSummary = memo(function BookingSummary({
  intent,
  selectedOffering,
  selectedSession,
  bookingMode,
  packageSize,
  calculateTotal,
  userData,
  setUserData,
  isSubmitting,
  onFinalize,
}: BookingSummaryProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto px-4">
      {/* Review Column */}
      <div className="space-y-10 sticky top-32 lg:pr-10 border-r border-[#f1e4da]/50">
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#a55a3d]/40">Your Sanctuary Seal</span>
          <h3 className="text-4xl font-serif text-[#4a3b32] tracking-tighter uppercase italic">Manifestation <br/> Summary</h3>
        </div>
        
        <div className="space-y-8 pl-4">
           <div className="space-y-2 group cursor-default">
              <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#bc6746]/60 transition-all group-hover:tracking-[0.4em]">Practice Space</span>
              <p className="text-3xl font-serif text-[#4a3b32] leading-[1.1]">{selectedOffering?.title}</p>
           </div>
           {intent === "group" && (
              <div className="space-y-2 group cursor-default">
                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#bc6746]/60 transition-all group-hover:tracking-[0.4em]">Journey Type</span>
                <p className="text-xl text-[#4a3b32]/80 font-serif italic">{bookingMode === 'single' ? 'Individual Session' : `${packageSize} Session Package`}</p>
              </div>
           )}
           {intent === "group" && selectedSession && (
             <div className="space-y-2 group cursor-default">
                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#bc6746]/60 transition-all group-hover:tracking-[0.4em]">Time Signature</span>
                <p className="text-xl text-[#4a3b32]/80 font-serif italic">
                  {new Date(selectedSession.session_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} at {selectedSession.start_time}
                </p>
             </div>
           )}
           {intent === "group" && (
              <div className="pt-10">
                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#bc6746]/60 mb-2 block">Energy Exchange</span>
                <div className="text-6xl font-serif text-[#bc6746] tracking-tighter">₹{calculateTotal()}</div>
              </div>
           )}
           {intent === "private" && (
              <div className="pt-10 flex items-center gap-4 text-[#a55a3d]">
                 <Heart className="w-5 h-5 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Consultation Request Path</span>
              </div>
           )}
        </div>
      </div>

      {/* Form Column */}
      <div className="space-y-10 bg-white p-12 md:p-16 rounded-[40px] md:rounded-[60px] shadow-2xl shadow-[#bc6746]/5 border border-[#f1e4da] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#f1e4da] via-[#bc6746]/20 to-[#f1e4da]" />
        <h3 className="text-3xl font-serif text-[#4a3b32] uppercase tracking-tighter">Guardian Details</h3>
        <div className="space-y-8">
          <div className="relative group">
            <input 
               type="text" 
               placeholder="Full Name"
               value={userData.name}
               onChange={(e) => setUserData({ ...userData, name: e.target.value })}
               className="w-full bg-transparent border-b border-[#f1e4da] py-4 outline-none focus:border-[#bc6746] transition-all text-xl font-serif text-[#4a3b32] placeholder-[#a55a3d]/20"
            />
            <User className="absolute right-0 bottom-4 w-5 h-5 text-[#a55a3d]/20 group-focus-within:text-[#bc6746] transition-colors" />
          </div>
          <div className="relative group">
            <input 
               type="email" 
               placeholder="Digital Address (Email)"
               value={userData.email}
               onChange={(e) => setUserData({ ...userData, email: e.target.value })}
               className="w-full bg-transparent border-b border-[#f1e4da] py-4 outline-none focus:border-[#bc6746] transition-all text-xl font-serif text-[#4a3b32] placeholder-[#a55a3d]/20"
            />
            <Mail className="absolute right-0 bottom-4 w-5 h-5 text-[#a55a3d]/20 group-focus-within:text-[#bc6746] transition-colors" />
          </div>
          {intent === "private" && (
             <div className="space-y-4 pt-4">
               <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#a55a3d]/50">Manifest your intent</label>
               <textarea 
                 rows={4}
                 placeholder="Whisper your preferred timings or specific resonance goals..."
                 value={userData.message}
                 onChange={(e) => setUserData({ ...userData, message: e.target.value })}
                 className="w-full bg-[#fffdf8] border border-[#f1e4da] rounded-3xl p-6 outline-none focus:border-[#bc6746] transition-all text-[#4a3b32] font-serif placeholder-[#a55a3d]/30 h-40 italic leading-relaxed"
               />
             </div>
          )}
        </div>

        <div className="pt-8">
          <button 
            onClick={onFinalize}
            disabled={isSubmitting}
            className="w-full py-8 md:py-10 rounded-[30px] bg-[#bc6746] text-white font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-[#bc6746]/40 hover:bg-[#a55a3d] hover:scale-[0.99] active:scale-95 transition-all flex items-center justify-center gap-5 group"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (intent === "group" ? <>Begin Initiation <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform"/></> : "Manifest Resonance Request")}
          </button>
          <div className="flex items-center justify-center gap-3 mt-8">
             <CreditCard className="w-4 h-4 text-[#a55a3d]/30" />
             <p className="text-[9px] text-[#a55a3d]/50 uppercase tracking-[0.4em] font-black italic">Secure manifestation gateway</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default BookingSummary;
