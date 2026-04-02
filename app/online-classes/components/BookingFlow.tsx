"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  Calendar as CalendarIcon, 
  CreditCard,
  User,
  Mail,
  Loader2,
  Sparkles
} from "lucide-react";
import { yogaService } from "@/lib/api/client";
import { toast } from "react-toastify";

// Define Types
interface Offering {
  id: string;
  title: string;
  description: string;
  duration: string;
  single_price: number;
  package_5_price: number;
  package_10_price: number;
  package_15_price: number;
}

interface Session {
  id: string;
  session_date: string;
  start_time: string;
  capacity: number;
  booked_count: number;
  meeting_link: string;
}

const STEPS = [
  "Choose your Practice",
  "Session Type",
  "Choose your Amount",
  "Select a Time",
  "Review & Begin"
];

export default function BookingFlow() {
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
  const [userData, setUserData] = useState({ name: "", email: "" });

  // 1. Initial Load: Fetch Offerings
  useEffect(() => {
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

  // 2. Fetch Slots when offering is selected
  useEffect(() => {
    if (selectedOffering) {
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
  }, [selectedOffering]);

  const handleNext = () => {
    // Basic validation per step
    if (currentStep === 0 && !selectedOffering) return toast.info("Please select a practice");
    if (currentStep === 3 && bookingMode === "single" && !selectedSession) return toast.info("Please select a time slot");
    if (currentStep === 4 && (!userData.name || !userData.email)) return toast.info("Please fill in your details");
    
    // Logic for skipping package size if single
    if (currentStep === 1 && bookingMode === "single") {
       setCurrentStep(3); // Skip package size
    } else {
       setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    if (currentStep === 3 && bookingMode === "single") {
       setCurrentStep(1); // Jump back to type
    } else {
       setCurrentStep(prev => Math.max(prev - 1, 0));
    }
  };

  const calculateTotal = () => {
    if (!selectedOffering) return 0;
    if (bookingMode === "single") return selectedOffering.single_price;
    if (packageSize === 5) return selectedOffering.package_5_price;
    if (packageSize === 10) return selectedOffering.package_10_price;
    if (packageSize === 15) return selectedOffering.package_15_price;
    return 0;
  };

  const finalizeBooking = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        session_id: selectedSession?.id,
        user_name: userData.name,
        user_email: userData.email,
        booking_type: bookingMode,
        package_size: packageSize,
        total_amount: calculateTotal(),
        payment_id: "PAY-" + Math.random().toString(36).substr(2, 9), // Mock payment ID
      };
      
      await yogaService.bookings.create(payload);
      toast.success("Manifestation Successful! Welcome to the sanctuary.");
      setCurrentStep(STEPS.length); // Final success state
    } catch (err) {
      toast.error("Failed to book session");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-[#bc6746]"><Loader2 className="animate-spin inline mr-2" /> Entering sanctuary...</div>;

  return (
    <div className="w-full relative min-h-[600px]">
      
      {/* Progress Indicator */}
      {currentStep < STEPS.length && (
        <div className="mb-12 flex justify-between items-center max-w-xl mx-auto">
          {STEPS.map((step, idx) => (
            <div key={idx} className="flex items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors duration-500
                  ${currentStep >= idx ? 'bg-[#bc6746] text-[#FFFDF8]' : 'bg-[#f1e4da] text-[#bc6746]/40'}`}
              >
                {currentStep > idx ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`w-8 sm:w-16 h-[2px] mx-2 ${currentStep > idx ? 'bg-[#bc6746]' : 'bg-[#bc6746]/10'}`} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Main Flow Content */}
      <AnimatePresence mode="wait">
        
        {/* Step 1: Offerings */}
        {currentStep === 0 && (
          <motion.div 
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {offerings.map(offering => (
              <div 
                key={offering.id}
                onClick={() => setSelectedOffering(offering)}
                className={`group p-8 rounded-2xl border-2 transition-all cursor-pointer soft-glass relative overflow-hidden
                  ${selectedOffering?.id === offering.id ? 'border-[#bc6746] bg-white ring-4 ring-[#bc6746]/5' : 'border-white/20 bg-white/40 hover:border-[#bc6746]/30'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-serif uppercase tracking-wider text-[#4a3b32]">{offering.title}</h3>
                  {selectedOffering?.id === offering.id && <Sparkles className="w-5 h-5 text-[#bc6746]" />}
                </div>
                <p className="text-[#6b584c] font-light mb-6">{offering.description}</p>
                <div className="flex items-center text-xs text-[#bc6746] uppercase tracking-widest font-bold">
                  <Clock className="w-3 h-3 mr-1" /> {offering.duration}
                  <span className="mx-3 text-[#bc6746]/20">|</span>
                  <span>From ₹{offering.single_price}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Step 2: Single vs Package */}
        {currentStep === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-12">
               <h2 className="text-3xl font-serif text-[#4a3b32] mb-2 tracking-wide uppercase">Journey Type</h2>
               <p className="text-slate-500 italic">Select a single encounter or a committed sequence</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div 
                onClick={() => setBookingMode("single")}
                className={`p-10 rounded-2xl border-2 text-center transition-all cursor-pointer 
                  ${bookingMode === "single" ? 'border-[#bc6746] bg-white' : 'border-white/20 bg-white/40 hover:bg-white/60'}`}
              >
                <h4 className="uppercase tracking-[0.2em] font-bold text-sm mb-2 text-[#bc6746]">Individual</h4>
                <p className="text-3xl font-serif text-[#4a3b32]">Single <br/> Session</p>
              </div>
              <div 
                onClick={() => setBookingMode("package")}
                className={`p-10 rounded-2xl border-2 text-center transition-all cursor-pointer 
                  ${bookingMode === "package" ? 'border-[#bc6746] bg-white' : 'border-white/20 bg-white/40 hover:bg-white/60'}`}
              >
                <h4 className="uppercase tracking-[0.2em] font-bold text-sm mb-2 text-[#bc6746]">Journey</h4>
                <p className="text-3xl font-serif text-[#4a3b32]">Session <br/> Package</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Package Size (only if package) */}
        {currentStep === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl font-serif text-[#4a3b32] mb-12 tracking-wide uppercase">Select Package Amount</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {[5, 10, 15].map(size => (
                <button 
                  key={size}
                  onClick={() => setPackageSize(size as any)}
                  className={`px-12 py-6 rounded-full border-2 transition-all text-xl font-serif
                    ${packageSize === size ? 'bg-[#bc6746] text-white border-[#bc6746]' : 'bg-white/40 border-white/20 hover:border-[#bc6746]/30 text-[#4a3b32]'}`}
                >
                  {size} Sessions
                </button>
              ))}
            </div>
            {selectedOffering && (
               <p className="mt-8 text-xl font-light text-[#bc6746]">
                 Total: ₹{packageSize === 5 ? selectedOffering.package_5_price : packageSize === 10 ? selectedOffering.package_10_price : selectedOffering.package_15_price}
               </p>
            )}
          </motion.div>
        )}

        {/* Step 4: Time Selection (slots) */}
        {currentStep === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12 space-y-2">
              <h2 className="text-3xl font-serif text-[#4a3b32] tracking-wide uppercase">Choose Your Slot</h2>
              <p className="text-slate-500 font-light italic">Available moments for your {selectedOffering?.title}</p>
            </div>
            
            {sessions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sessions.map(session => (
                  <div 
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className={`p-6 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between
                      ${selectedSession?.id === session.id ? 'border-[#bc6746] bg-white ring-4 ring-[#bc6746]/5' : 'border-white/20 bg-white/40 hover:bg-white/70'}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg bg-[#bc6746]/5 text-[#bc6746]">
                        <CalendarIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-[#4a3b32]">{new Date(session.session_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                        <p className="text-xs text-[#bc6746] uppercase tracking-widest">{session.start_time}</p>
                      </div>
                    </div>
                    {selectedSession?.id === session.id && <div className="h-6 w-6 rounded-full bg-[#bc6746] flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 p-8 border-2 border-dashed border-white/20 rounded-2xl bg-white/20">
                 <p className="text-[#6b584c] italic">All slots currently fully manifested. Please check back gently.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 5: Summary & Payment */}
        {currentStep === 4 && (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start"
          >
            {/* Booking Summary */}
            <div className="p-10 rounded-3xl border border-white/20 soft-glass space-y-8">
               <h3 className="text-lg font-serif uppercase tracking-widest text-[#bc6746] border-b border-[#bc6746]/10 pb-4">Booking Journey</h3>
               
               <div className="space-y-6">
                 <div className="flex justify-between items-end">
                    <span className="text-xs uppercase tracking-widest text-slate-400">Practice</span>
                    <span className="text-xl font-serif text-[#4a3b32]">{selectedOffering?.title}</span>
                 </div>
                 <div className="flex justify-between items-end">
                    <span className="text-xs uppercase tracking-widest text-slate-400">Duration</span>
                    <span className="text-[#4a3b32]">{bookingMode === 'single' ? 'Single Session' : `${packageSize} Sessions Package`}</span>
                 </div>
                 {bookingMode === 'single' && selectedSession && (
                    <div className="flex justify-between items-end">
                       <span className="text-xs uppercase tracking-widest text-slate-400">Time</span>
                       <span className="text-[#4a3b32]">{new Date(selectedSession.session_date).toLocaleDateString()} at {selectedSession.start_time}</span>
                    </div>
                 )}
                 <div className="pt-8 flex justify-between items-center border-t border-[#bc6746]/10">
                    <span className="text-xs uppercase tracking-widest font-bold text-[#bc6746]">Investment</span>
                    <span className="text-3xl font-serif text-[#4a3b32]">₹{calculateTotal()}</span>
                 </div>
               </div>
            </div>

            {/* Payment Form */}
            <div className="space-y-8">
               <h3 className="text-2xl font-serif text-[#4a3b32] uppercase tracking-wide">Contact Details</h3>
               <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Full Name"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-white/40 bg-white/20 backdrop-blur-md focus:outline-none focus:border-[#bc6746] transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="email" 
                      placeholder="Email Address"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-white/40 bg-white/20 backdrop-blur-md focus:outline-none focus:border-[#bc6746] transition-colors"
                    />
                  </div>
               </div>

               <button 
                  disabled={isSubmitting}
                  onClick={finalizeBooking}
                  className="w-full py-5 rounded-full bg-[#bc6746] text-[#FFFDF8] uppercase tracking-[0.2em] text-sm font-bold shadow-xl shadow-[#bc6746]/20 flex items-center justify-center hover:-translate-y-1 transition-all"
               >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Journey Initiation"}
               </button>
               <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                 <CreditCard className="w-3 h-3" /> Secure Payment Initiation
               </p>
            </div>
          </motion.div>
        )}

        {/* Success State */}
        {currentStep === STEPS.length && (
           <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto p-12 soft-glass rounded-3xl text-center border border-[#bc6746]/20 bg-white/40"
          >
            <div className="w-20 h-20 rounded-full bg-[#bc6746]/10 text-[#bc6746] flex items-center justify-center mx-auto mb-8">
               <Check className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-serif text-[#4a3b32] mb-4 uppercase tracking-wider">Session Manifested</h2>
            <p className="text-[#6b584c] mb-8 font-light leading-relaxed">
              Gratitude for joining our sanctuary. A confirmation email with the meeting link <br/>
              has been whispered to your inbox.
            </p>
            <button 
               onClick={() => window.location.href = "/"}
               className="px-10 py-4 rounded-full border border-[#bc6746] text-[#bc6746] uppercase tracking-widest text-xs font-bold hover:bg-[#bc6746] hover:text-white transition-all"
            >
              Return Home
            </button>
          </motion.div>
        )}
        
      </AnimatePresence>

      {/* Navigation Buttons */}
      {currentStep < STEPS.length && (
        <div className="mt-16 flex justify-between items-center max-w-4xl mx-auto pt-8 border-t border-white/10">
          <button 
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center text-xs uppercase tracking-widest font-bold transition-all
              ${currentStep === 0 ? 'opacity-0' : 'text-slate-400 hover:text-[#bc6746]'}`}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
          </button>
          
          {currentStep < 4 && (
            <button 
              onClick={handleNext}
              className="flex items-center text-xs uppercase tracking-[0.2em] font-bold text-[#bc6746] hover:translate-x-1 transition-all"
            >
              Next Phase <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
