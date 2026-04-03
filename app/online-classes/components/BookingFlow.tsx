"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronLeft, 
  Loader2,
  Check,
  CalendarCheck,
  Zap
} from "lucide-react"; 
import { yogaService } from "@/lib/api/client";
import { toast } from "react-toastify";

// Sub-components
import SelectionColumn from "./flow/SelectionColumn";
import OrderSummarySidebar from "./flow/OrderSummarySidebar";
import PaymentStep from "./flow/PaymentStep"; // For the manual screenshot upload part
import Antigravity from "@/app/components/Antaigravity";
import { useYogaRealtime } from "@/lib/hooks/useYogaRealtime";
import { Offering, Session, UserData } from "./flow/types";

export default function BookingFlow() {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<'booking' | 'payment' | 'success'>('booking');
  const [loading, setLoading] = useState(true);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [initialSessions, setInitialSessions] = useState<Session[]>([]);
  const [exceptions, setExceptions] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gstPercent, setGstPercent] = useState(18);

  // Selections
  const [selectedOffering, setSelectedOffering] = useState<Offering | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [userData, setUserData] = useState<UserData>({ name: "", email: "", phone: "", message: "" });

  const { sessions, exceptions: realtimeExceptions } = useYogaRealtime(initialSessions, exceptions);

  useEffect(() => {
    setMounted(true);
    async function load() {
      try {
        const [offeringRes, availabilityRes] = await Promise.all([
          yogaService.offerings.list(),
          yogaService.sessions.list()
        ]);
        setOfferings(offeringRes.data.data);
        setInitialSessions(availabilityRes.data.data.sessions || []);
        setExceptions(availabilityRes.data.data.exceptions || []);
      } catch (err) {
        toast.error("Failed to load sanctuary data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const canProceed = useMemo(() => {
    return !!selectedOffering && !!selectedDate && !!selectedSession && !!userData.name && !!userData.email && !!userData.phone;
  }, [selectedOffering, selectedDate, selectedSession, userData]);

  const finalizeBooking = async (verifiedPaymentData: { reference: string, screenshotUrl?: string }) => {
    setIsSubmitting(true);
    try {
      const GST_RATE = 0.18;
      const base_amount = selectedOffering?.single_price || 0;
      const gst_amount = base_amount * GST_RATE;
      const total_amount = base_amount + gst_amount;

      const payload = {
        reference_id: selectedSession?.id,
        user_name: userData.name,
        user_email: userData.email,
        user_phone: userData.phone,
        booking_type: "yoga",
        total_amount,
        amount: base_amount,
        gst_amount,
        payment_reference: verifiedPaymentData.reference,
        payment_screenshot_url: verifiedPaymentData.screenshotUrl,
        metadata: {
            offering_title: selectedOffering?.title,
            session_date: selectedSession?.session_date
        }
      };

      const res = await yogaService.bookings.create(payload);
      if (res.data.success) {
        toast.success("Booking request initialized!");
        setView('success');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to process booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] flex-col items-center justify-center text-[#bc6746]">
        <Loader2 className="animate-spin h-8 w-8 mb-4" /> 
        <p className="text-xs font-black uppercase tracking-widest opacity-40 italic">Syncing Sanctuary...</p>
    </div>
  );

  return (
    <div className="w-full relative py-4 md:py-8 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 opacity-10 pointer-events-none">
        <Antigravity count={40} color="#bc6746" />
      </div>

      <AnimatePresence mode="wait">
        
        {/* VIEW 1: Main Selections */}
        {view === 'booking' && (
          <motion.div 
            key="booking-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto"
          >
             <div className="bg-white/40 md:bg-white/60 md:backdrop-blur-2xl md:rounded-[60px] md:border md:border-[#f1e4da] md:shadow-2xl md:shadow-[#bc6746]/5 p-2 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                   
                   {/* Column Left: Inputs */}
                   <div className="lg:col-span-12 xl:col-span-9 order-2 lg:order-1">
                   <SelectionColumn 
                      offerings={offerings}
                      sessions={sessions}
                      exceptions={realtimeExceptions}
                      selectedOffering={selectedOffering}
                      selectedDate={selectedDate}
                      selectedSession={selectedSession}
                      userData={userData}
                      onSelectOffering={setSelectedOffering}
                      onSelectDate={setSelectedDate}
                      onSelectSession={setSelectedSession}
                      setUserData={setUserData}
                   />
                </div>

                {/* Column Right: Order Summary */}
                <div className="lg:col-span-12 xl:col-span-3 order-1 lg:order-2">
                   <OrderSummarySidebar 
                      offering={selectedOffering}
                      session={selectedSession}
                      date={selectedDate}
                      gstPercent={gstPercent}
                      isSubmitting={isSubmitting}
                      canProceed={canProceed}
                      onProceed={() => setView('payment')}
                   />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: Payment Step (Dedicated Modal/View) */}
        {view === 'payment' && (
            <motion.div 
              key="payment-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="max-w-4xl mx-auto py-4"
            >
                <div className="mb-12">
                   <button 
                      onClick={() => setView('booking')}
                      className="group flex items-center text-[10px] font-black uppercase tracking-[0.4em] text-[#a55a3d]/40 hover:text-[#bc6746] transition-all"
                   >
                     <ChevronLeft className="w-5 h-5 mr-3" /> Back to Selection
                   </button>
                </div>

                <PaymentStep 
                   offering={selectedOffering!}
                   session={selectedSession}
                   bookingMode="single"
                   packageSize={1}
                   totalAmount={(selectedOffering!.single_price * (1 + gstPercent/100))} 
                   userData={userData}
                   isSubmitting={isSubmitting}
                   onFinalize={() => {}} 
                   onCompleteManual={finalizeBooking}
                />
            </motion.div>
        )}

        {/* VIEW 3: Success State */}
        {view === 'success' && (
          <motion.div 
            key="success-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto text-center space-y-12 py-24 px-8 bg-white/60 backdrop-blur-3xl rounded-[60px] border border-[#f1e4da] shadow-2xl"
          >
            <div className="w-24 h-24 rounded-full bg-[#bc6746] text-white flex items-center justify-center mx-auto shadow-xl relative group">
                <div className="absolute inset-0 bg-[#bc6746] rounded-full animate-ping opacity-20" />
                <Check className="w-12 h-12 relative z-10" />
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl font-serif text-[#4a3b32] tracking-tighter leading-none italic uppercase">Order Received</h2>
              <p className="text-[#a55a3d] font-light text-xl max-w-lg mx-auto leading-relaxed">
                Thank you, <strong>{userData.name}</strong>. Your payment reference and proof have been uploaded. We will verify the transaction and confirm your sanctuary slot via email shortly.
              </p>
            </div>
            <div className="pt-8">
              <button 
                onClick={() => window.location.href = "/"}
                className="px-16 py-6 rounded-full bg-[#4a3b32] text-white font-black uppercase tracking-[0.4em] text-[10px] hover:bg-[#bc6746] transition-all shadow-xl shadow-[#bc6746]/20"
              >
                Return Home
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
