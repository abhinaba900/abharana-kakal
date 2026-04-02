"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronLeft, 
  Loader2,
  Check
} from "lucide-react"; 
import { yogaService, enquiryService } from "@/lib/api/client";
import { toast } from "react-toastify";

// Sub-components
import IntentStep from "./flow/IntentStep";
import OfferingStep from "./flow/OfferingStep";
import SessionStep from "./flow/SessionStep";
import BookingSummary from "./flow/BookingSummary";
import BookingProgress from "./flow/BookingProgress";
import { Offering, Session, UserData } from "./flow/types";

const STEPS = [
  "Choose your Practice",
  "Session Type",
  "Your Investment", // For Packages
  "Select a Time",
  "Review & Begin"
];

export default function BookingFlow() {
  const [mounted, setMounted] = useState(false);
  const [intent, setIntent] = useState<"group" | "private" | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Booking Data State
  const [selectedOffering, setSelectedOffering] = useState<Offering | null>(null);
  const [bookingMode, setBookingMode] = useState<"single" | "package">("single");
  const [packageSize, setPackageSize] = useState<1 | 5 | 10 | 15>(1);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [userData, setUserData] = useState<UserData>({ name: "", email: "", message: "" });

  useEffect(() => {
    setMounted(true);
    async function load() {
      try {
        const res = await yogaService.offerings.list();
        setOfferings(res.data.data);
      } catch (err) {
        toast.error("Failed to fetch offerings");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Fetch Slots when offering is selected (for Group)
  useEffect(() => {
    if (selectedOffering && intent === "group") {
      async function loadSessions() {
        try {
           const res = await yogaService.sessions.list(selectedOffering?.id);
           setSessions(res.data.data);
        } catch (err) {
           toast.error("Failed to fetch sessions");
        }
      }
      loadSessions();
    }
  }, [selectedOffering, intent]);

  const handleNext = useCallback(() => {
    if (currentStep === 0 && !selectedOffering) return toast.info("Please select a practice");
    if (intent === "group") {
       if (currentStep === 3 && bookingMode === "single" && !selectedSession) return toast.info("Please select a time slot");
       if (currentStep === 4 && (!userData.name || !userData.email)) return toast.info("Please fill in your details");
       
       if (currentStep === 1 && bookingMode === "single") {
          setCurrentStep(3); // Skip package size
       } else {
          setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
       }
    } else {
       if (currentStep === 0) setCurrentStep(4);
    }
  }, [currentStep, selectedOffering, intent, bookingMode, selectedSession, userData]);

  const handleBack = useCallback(() => {
    if (currentStep === 4 && intent === "private") {
       setCurrentStep(0);
       return;
    }
    if (currentStep === 3 && bookingMode === "single") {
       setCurrentStep(1); 
    } else {
       setCurrentStep(prev => Math.max(prev - 1, 0));
    }
  }, [currentStep, intent, bookingMode]);

  const calculateTotal = useCallback(() => {
    if (!selectedOffering) return 0;
    if (bookingMode === "single") return selectedOffering.single_price;
    if (packageSize === 5) return selectedOffering.package_5_price;
    if (packageSize === 10) return selectedOffering.package_10_price;
    if (packageSize === 15) return selectedOffering.package_15_price;
    return 0;
  }, [selectedOffering, bookingMode, packageSize]);

  const finalizeBooking = async () => {
    setIsSubmitting(true);
    try {
      if (intent === "group") {
        const payload = {
          session_id: selectedSession?.id,
          user_name: userData.name,
          user_email: userData.email,
          booking_type: bookingMode,
          package_size: packageSize,
          total_amount: calculateTotal(),
          payment_id: "PAY-" + Math.random().toString(36).substr(2, 9),
        };
        await yogaService.bookings.create(payload);
        toast.success("Manifestation Successful! Welcome back home.");
      } else {
        const payload = {
          name: userData.name,
          email: userData.email,
          subject: `Private Booking Request: ${selectedOffering?.title}`,
          message: `Practice: ${selectedOffering?.title}\n\nClient Message: ${userData.message}`,
        };
        await enquiryService.create(payload);
        toast.success("Request Manifested. We will reach out shortly to align our energies.");
      }
      setCurrentStep(STEPS.length + 1); // Success
    } catch (err) {
      toast.error("Failed to manifest booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-40 text-[#bc6746]"><Loader2 className="animate-spin inline mr-2" /> Entering sanctuary...</div>;

  return (
    <div id="book" className="w-full relative min-h-[600px]">
      <AnimatePresence mode="wait">
        
        {/* Step -1: Intent Selection */}
        {!intent && (
          <IntentStep key="intent" onSelect={setIntent} />
        )}

        {intent && currentStep <= STEPS.length && (
          <motion.div 
            key="flow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
          >
            {/* Progress */}
            {intent === "group" && (
              <BookingProgress steps={STEPS} currentStep={currentStep} />
            )}

            {/* Step Content */}
            <div className="max-w-6xl mx-auto min-h-[400px]">
              {/* Step 0: Offerings */}
              {currentStep === 0 && (
                <OfferingStep 
                  offerings={offerings} 
                  selectedOffering={selectedOffering} 
                  onSelect={setSelectedOffering} 
                />
              )}

              {/* Step 1: Mode */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
                   <div 
                    onClick={() => setBookingMode("single")}
                    className={`p-16 rounded-[50px] border-2 text-center transition-all cursor-pointer space-y-6
                      ${bookingMode === "single" ? 'border-[#bc6746] bg-white shadow-2xl shadow-[#bc6746]/10' : 'border-[#f1e4da] bg-white/40 hover:bg-white/60 hover:tracking-wide'}`}
                  >
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#bc6746]/60">Single Encounter</h4>
                    <p className="text-4xl font-serif text-[#4a3b32] tracking-tighter">Individual <br/> Session</p>
                  </div>
                  <div 
                    onClick={() => setBookingMode("package")}
                    className={`p-16 rounded-[50px] border-2 text-center transition-all cursor-pointer space-y-6
                      ${bookingMode === "package" ? 'border-[#bc6746] bg-white shadow-2xl shadow-[#bc6746]/10' : 'border-[#f1e4da] bg-white/40 hover:bg-white/60 hover:tracking-wide'}`}
                  >
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#bc6746]/60">Sacred Sequence</h4>
                    <p className="text-4xl font-serif text-[#4a3b32] tracking-tighter">Journey <br/> Package</p>
                  </div>
                </div>
              )}

              {/* Step 2: Package Size */}
              {currentStep === 2 && (
                <div className="flex flex-wrap justify-center gap-10 py-12 px-4">
                   {[5, 10, 15].map(size => (
                    <button 
                      key={size}
                      onClick={() => setPackageSize(size as any)}
                      className={`px-16 py-10 rounded-[40px] border-2 transition-all font-serif text-3xl
                        ${packageSize === size ? 'bg-[#bc6746] text-white border-[#bc6746] shadow-2xl shadow-[#bc6746]/20 scale-105' : 'bg-white/40 border-[#f1e4da] text-[#4a3b32] hover:bg-white/60 hover:scale-[1.02]'}`}
                    >
                      {size} Classes
                    </button>
                  ))}
                </div>
              )}

              {/* Step 3: Slots */}
              {currentStep === 3 && (
                <SessionStep 
                  sessions={sessions} 
                  selectedSession={selectedSession} 
                  onSelect={setSelectedSession} 
                  onSwitchToPrivate={() => setIntent("private")}
                />
              )}

              {/* Step 4: Finalize */}
              {currentStep === 4 && (
                <BookingSummary 
                  intent={intent}
                  selectedOffering={selectedOffering}
                  selectedSession={selectedSession}
                  bookingMode={bookingMode}
                  packageSize={packageSize}
                  calculateTotal={calculateTotal}
                  userData={userData}
                  setUserData={setUserData}
                  isSubmitting={isSubmitting}
                  onFinalize={finalizeBooking}
                />
              )}
            </div>

            {/* Navigation Footer */}
            <div className="pt-16 pb-8 flex flex-col md:flex-row gap-8 justify-between items-center max-w-4xl mx-auto px-4">
                <button 
                  onClick={handleBack}
                  className="group flex items-center text-[11px] font-black uppercase tracking-[0.4em] text-[#a55a3d]/40 hover:text-[#bc6746] transition-all"
                >
                  <ChevronLeft className="w-5 h-5 mr-3 group-hover:-translate-x-2 transition-transform" /> Revisit Path
                </button>
                {currentStep < 4 && (
                  <button 
                    onClick={handleNext}
                    className="group flex items-center text-[11px] font-black uppercase tracking-[0.4em] text-[#bc6746] hover:tracking-[0.5em] transition-all"
                  >
                    Next Phase <ChevronRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                  </button>
                )}
            </div>
          </motion.div>
        )}

        {/* Success / Integration End */}
        {currentStep > STEPS.length && (
          <motion.div 
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto text-center space-y-12 py-24 px-4 bg-white/40 rounded-[80px] border border-[#f1e4da] shadow-2xl shadow-[#bc6746]/5"
          >
            <div className="w-32 h-32 rounded-full bg-[#bc6746] text-white flex items-center justify-center mx-auto shadow-2xl shadow-[#bc6746]/40 relative">
               <motion.div 
                 initial={{ scale: 0 }} 
                 animate={{ scale: 1.5, opacity: 0 }} 
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="absolute inset-0 rounded-full border-2 border-[#bc6746]"
               />
               <Check className="w-16 h-16" />
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-serif text-[#4a3b32] uppercase tracking-tighter font-medium italic leading-none">It is <br className="md:hidden"/> Manifested</h2>
              <p className="text-[#a55a3d] italic font-light text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed tracking-wide">
                Gratitude for joining our shared field. {intent === "group" ? "A confirmation with your sanctuary links has been sent to your digital address." : "We have received your private intent and will reach out shortly to align our energies for your personal journey."}
              </p>
            </div>
            <div className="pt-8">
              <button 
                onClick={() => window.location.href = "/"}
                className="px-16 py-6 rounded-[30px] border-2 border-[#bc6746] text-[#bc6746] font-black uppercase tracking-[0.4em] text-[11px] hover:bg-[#bc6746] hover:text-white transition-all duration-500 shadow-xl shadow-[#bc6746]/5 active:scale-95"
              >
                Return to Center
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
