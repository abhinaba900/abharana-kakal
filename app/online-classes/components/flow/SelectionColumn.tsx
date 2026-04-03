"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Mail, 
  Phone, 
  ChevronDown,
  Clock,
  CalendarDays,
  Gem
} from "lucide-react";
import { Offering, Session, UserData } from "./types";
import { Calendar } from "@/components/ui/Calendar";
import { cn, formatDateLocal, formatTime12h } from "@/lib/utils";

interface SelectionColumnProps {
  offerings: Offering[];
  sessions: Session[];
  exceptions: any[];
  selectedOffering: Offering | null;
  selectedDate: Date | null;
  selectedSession: Session | null;
  userData: UserData;
  onSelectOffering: (offering: Offering) => void;
  onSelectDate: (date: Date) => void;
  onSelectSession: (session: Session) => void;
  setUserData: (data: UserData) => void;
}

export default function SelectionColumn({
  offerings,
  sessions,
  exceptions,
  selectedOffering,
  selectedDate,
  selectedSession,
  userData,
  onSelectOffering,
  onSelectDate,
  onSelectSession,
  setUserData
}: SelectionColumnProps) {
  
  // Filter slots for the selected date and offering
  const availableSlots = React.useMemo(() => {
    if (!selectedDate || !sessions) return [];
    const dateStr = formatDateLocal(selectedDate);
    const now = new Date();
    
    return sessions.filter(s => {
        const isSelectedDate = s.session_date === dateStr;
        const isCorrectOffering = !selectedOffering || s.offering_id === selectedOffering.id;
        
        // Advanced Lifecycle Validation
        const sessionStart = new Date(`${s.session_date}T${s.start_time}`);
        const cooldownStart = new Date(sessionStart.getTime() - (s.cooldown_minutes || 60) * 60000);
        const sessionEnd = new Date(sessionStart.getTime() + (s.duration_minutes || 60) * 60000);
        
        const isPast = now > sessionEnd;
        const inCooldown = now > cooldownStart;
        const isBlocked = s.is_blocked || s.status === 'cancelled';
        
        return isSelectedDate && isCorrectOffering && !isPast && !inCooldown && !isBlocked;
    });
  }, [selectedDate, sessions, selectedOffering]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 items-start">
      
      {/* LEFT SUB-COL: Selection & Info */}
      <div className="space-y-8">
        {/* 1. Select Class Dropdown */}
        <section className="space-y-3">
          <label className="text-[9px] font-black uppercase tracking-[0.4em] text-[#bc6746] flex items-center gap-2">
              <Gem className="w-3 h-3" /> Select Practice
          </label>
          <div className="relative">
            <select 
              value={selectedOffering?.id || ""}
              onChange={(e) => {
                const off = offerings.find(o => o.id === e.target.value);
                if (off) onSelectOffering(off);
              }}
              className="w-full bg-white border border-[#f1e4da] rounded-2xl px-6 py-4 text-base font-serif text-[#4a3b32] outline-none appearance-none focus:ring-2 ring-[#bc6746]/10 transition-all cursor-pointer"
            >
              <option value="" disabled>Choose your practice...</option>
              {offerings.map(offering => (
                <option key={offering.id} value={offering.id}>
                  {offering.title} (₹{offering.single_price})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bc6746] pointer-events-none" />
          </div>
        </section>

        {/* 4. Your Details */}
        <section className="space-y-4 pt-4 border-t border-[#f1e4da]">
            <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-[#bc6746]">Personal Information</h3>
            <div className="grid grid-cols-1 gap-y-4">
                <div className="relative group">
                    <input 
                        type="text" 
                        placeholder="Full Name"
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        className="w-full bg-transparent border-b border-[#f1e4da] py-2.5 outline-none focus:border-[#bc6746] transition-all text-base font-serif text-[#4a3b32] placeholder-[#a55a3d]/20"
                    />
                    <Users className="absolute right-0 bottom-2.5 w-4 h-4 text-[#a55a3d]/20 group-focus-within:text-[#bc6746] transition-colors" />
                </div>
                <div className="relative group">
                    <input 
                        type="email" 
                        placeholder="Email Address"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        className="w-full bg-transparent border-b border-[#f1e4da] py-2.5 outline-none focus:border-[#bc6746] transition-all text-base font-serif text-[#4a3b32] placeholder-[#a55a3d]/20"
                    />
                    <Mail className="absolute right-0 bottom-2.5 w-4 h-4 text-[#a55a3d]/20 group-focus-within:text-[#bc6746] transition-colors" />
                </div>
                <div className="relative group">
                    <input 
                        type="tel" 
                        placeholder="Phone Number"
                        value={userData.phone}
                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                        className="w-full bg-transparent border-b border-[#f1e4da] py-2.5 outline-none focus:border-[#bc6746] transition-all text-base font-serif text-[#4a3b32] placeholder-[#a55a3d]/20"
                    />
                    <Phone className="absolute right-0 bottom-2.5 w-4 h-4 text-[#a55a3d]/20 group-focus-within:text-[#bc6746] transition-colors" />
                </div>
                <div className="space-y-2 pt-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#a55a3d]/40">Special Note</label>
                    <textarea 
                        rows={1}
                        placeholder="Injuries / Experience Level?"
                        value={userData.message}
                        onChange={(e) => setUserData({ ...userData, message: e.target.value })}
                        className="w-full bg-[#fffdf8] border border-[#f1e4da] rounded-xl p-3 outline-none focus:border-[#bc6746] transition-all text-[#4a3b32] font-serif placeholder-[#a55a3d]/20 h-16 italic text-sm"
                    />
                </div>
            </div>
        </section>
      </div>

      {/* RIGHT SUB-COL: Date & Time */}
      <div className="space-y-6">
        {/* 2. Choose Date */}
        <section className="space-y-3">
          <label className="text-[9px] font-black uppercase tracking-[0.4em] text-[#bc6746] flex items-center gap-2">
              <CalendarDays className="w-3 h-3" /> Choose Date
          </label>
          <div className="bg-white/40 p-2 rounded-[32px] border border-[#f1e4da]">
              <Calendar 
                  selectedDate={selectedDate}
                  onDateSelect={onSelectDate}
                  availabilityData={{ sessions, exceptions }}
              />
          </div>
        </section>

        {/* 3. Choose Time (Slots) - HORIZONTAL ROW */}
        <section className="space-y-3">
          <label className="text-[9px] font-black uppercase tracking-[0.4em] text-[#bc6746] flex items-center gap-2">
              <Clock className="w-3 h-3" /> Select Time
          </label>
          
          <div className="flex overflow-x-auto gap-3 pb-3 custom-scrollbar">
            {selectedDate ? (
                availableSlots.length > 0 ? (
                    availableSlots.map(slot => {
                        const isFull = slot.booked_count >= slot.capacity;
                        const isSelected = selectedSession?.id === slot.id;
                        
                        return (
                            <button
                                key={slot.id}
                                disabled={isFull}
                                onClick={() => onSelectSession(slot)}
                                className={cn(
                                    "min-w-max px-5 py-3 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center gap-0.5",
                                    isSelected 
                                        ? "bg-[#bc6746] border-[#bc6746] text-white shadow-lg" 
                                        : "bg-white border-[#f1e4da] text-[#4a3b32] hover:border-[#bc6746]/30",
                                    isFull && "opacity-30 cursor-not-allowed grayscale"
                                )}
                            >
                                <span className="font-serif italic text-sm leading-none">{formatTime12h(slot.start_time)}</span>
                                <span className="text-[8px] uppercase tracking-widest opacity-60">
                                    {isFull ? "Full" : `${slot.capacity - slot.booked_count} Lft`}
                                </span>
                            </button>
                        );
                    })
                ) : (
                    <div className="w-full py-4 text-center border border-dashed border-[#f1e4da] rounded-2xl opacity-40 italic text-[10px]">
                        No sessions found
                    </div>
                )
            ) : (
                <div className="w-full py-4 text-center border border-dashed border-[#f1e4da] rounded-2xl opacity-30 italic text-[10px]">
                    Select a date
                </div>
            )}
          </div>
        </section>
      </div>

    </div>
  );
}
