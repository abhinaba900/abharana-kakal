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
  Sparkles,
  Users,
  Heart
} from "lucide-react";
import { yogaService, enquiryService } from "@/lib/api/client";
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
  yoga_offerings?: { title: string };
}

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
  const [userData, setUserData] = useState({ name: "", email: "", message: "" });

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

  const handleNext = () => {
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
       // Private flow: Only 2 steps: Offering -> Request
       if (currentStep === 0) setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (currentStep === 4 && intent === "private") {
       setCurrentStep(0);
       return;
    }
    if (currentStep === 3 && bookingMode === "single") {
       setCurrentStep(1); 
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
        // Private Request -> Enquiry
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
          <motion.div 
            key="intent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-16 text-[#4a3b32]">
               <h2 className="text-4xl md:text-5xl font-serif mb-4 tracking-tighter uppercase font-medium">Choose Your Resonance</h2>
               <p className="text-[#a55a3d]/70 italic font-light tracking-wide">Select the path that calls to you today</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div 
                onClick={() => setIntent("group")}
                className="group p-12 rounded-[40px] border border-[#f1e4da] bg-white hover:border-[#bc6746]/50 transition-all cursor-pointer text-center space-y-6 shadow-sm hover:shadow-2xl hover:shadow-[#bc6746]/10"
              >
                <div className="w-20 h-20 rounded-3xl bg-[#bc6746]/5 text-[#bc6746] flex items-center justify-center mx-auto group-hover:bg-[#bc6746] group-hover:text-white transition-all duration-500 shadow-inner">
                  <Users className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-serif text-[#4a3b32] uppercase tracking-wide">Group Sanctuary</h3>
                <p className="text-sm text-[#a55a3d]/60 font-light px-4 leading-relaxed italic">Join our shared energy field with scheduled group practices and seasonal flow.</p>
                <div className="pt-4 text-[10px] font-black uppercase tracking-[0.34em] text-[#bc6746]">Explore Classes</div>
              </div>

              <div 
                onClick={() => setIntent("private")}
                className="group p-12 rounded-[40px] border border-[#f1e4da] bg-white hover:border-[#bc6746]/50 transition-all cursor-pointer text-center space-y-6 shadow-sm hover:shadow-2xl hover:shadow-[#bc6746]/10"
              >
                <div className="w-20 h-20 rounded-3xl bg-[#bc6746]/5 text-[#bc6746] flex items-center justify-center mx-auto group-hover:bg-[#bc6746] group-hover:text-white transition-all duration-500 shadow-inner">
                  <Heart className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-serif text-[#4a3b32] uppercase tracking-wide">Private Resonance</h3>
                <p className="text-sm text-[#a55a3d]/60 font-light px-4 leading-relaxed italic">A tailored one-on-one journey designed specifically for your unique nervous system.</p>
                <div className="pt-4 text-[10px] font-black uppercase tracking-[0.34em] text-[#bc6746]">Personal Consultation</div>
              </div>
            </div>
          </motion.div>
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
              <div className="mb-12 flex justify-between items-center max-w-xl mx-auto px-4">
                {STEPS.map((step, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 shadow-sm
                        ${currentStep >= idx ? 'bg-[#bc6746] text-white ring-4 ring-[#bc6746]/10' : 'bg-[#f1e4da] text-[#bc6746]/40'}`}>
                      {currentStep > idx ? <Check className="w-4 h-4" /> : idx + 1}
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className={`w-8 sm:w-16 h-[1px] mx-2 transition-colors duration-500 ${currentStep > idx ? 'bg-[#bc6746]' : 'bg-[#bc6746]/10'}`} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Step Content */}
            <div className="max-w-6xl mx-auto min-h-[400px]">
              {/* Step 0: Offerings */}
              {currentStep === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                  {offerings.map(offering => (
                    <motion.div 
                      key={offering.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setSelectedOffering(offering)}
                      className={`group p-10 rounded-[40px] border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between
                        ${selectedOffering?.id === offering.id 
                          ? 'border-[#bc6746] bg-white shadow-2xl shadow-[#bc6746]/10' 
                          : 'border-[#f1e4da] bg-white/40 hover:bg-white/80 hover:border-[#bc6746]/20'}`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <h3 className="text-2xl font-serif text-[#4a3b32] uppercase tracking-wide">{offering.title}</h3>
                          {selectedOffering?.id === offering.id && <Sparkles className="w-5 h-5 text-[#bc6746] animate-pulse" />}
                        </div>
                        <p className="text-sm text-[#4a3b32]/60 font-light leading-relaxed mb-10 tracking-wide italic">{offering.description}</p>
                      </div>
                      <div className="flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-[#bc6746]">
                        <Clock className="w-3 h-3 mr-2" /> {offering.duration}
                        <span className="mx-6 text-[#bc6746]/20 font-light">|</span>
                        <span>From ₹{offering.single_price}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Step 1: Mode */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
                   <div 
                    onClick={() => setBookingMode("single")}
                    className={`p-16 rounded-[50px] border-2 text-center transition-all cursor-pointer space-y-6
                      ${bookingMode === "single" ? 'border-[#bc6746] bg-white shadow-2xl shadow-[#bc6746]/10 animate-pulse-slow' : 'border-[#f1e4da] bg-white/40 hover:bg-white/60 hover:tracking-wide'}`}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                  {sessions.length > 0 ? sessions.map(session => (
                    <div 
                      key={session.id}
                      onClick={() => setSelectedSession(session)}
                      className={`p-10 rounded-[40px] border-2 transition-all cursor-pointer flex flex-col justify-between space-y-8
                        ${selectedSession?.id === session.id ? 'border-[#bc6746] bg-white shadow-2xl shadow-[#bc6746]/10' : 'border-[#f1e4da] bg-white/40 hover:bg-white/80 hover:border-[#bc6746]/20'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="p-4 rounded-3xl bg-[#bc6746]/5 text-[#bc6746] shadow-sm">
                          <CalendarIcon className="w-7 h-7" />
                        </div>
                        {selectedSession?.id === session.id && (
                          <div className="bg-[#bc6746] text-white rounded-full p-2 animate-in zoom-in">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div>
                        {mounted && (
                          <p className="text-2xl font-serif text-[#4a3b32]">
                            {new Date(session.session_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        )}
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#bc6746] mt-2 italic font-mono transition-all group-hover:tracking-[0.5em]">{session.start_time}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full text-center py-24 bg-white/10 rounded-[50px] border-2 border-dashed border-[#f1e4da] group">
                      <p className="italic text-[#4a3b32]/40 font-light text-xl tracking-wide">No group sessions manifested for this practice. <br className="hidden md:block"/> Consider a private resonance for a tailored experience.</p>
                      <button onClick={() => setIntent("private")} className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-[#bc6746] hover:scale-105 transition-all">Switch to Private Resonance</button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Finalize */}
              {currentStep === 4 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto px-4">
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
                         {intent === "group" && selectedSession && mounted && (
                           <div className="space-y-2 group cursor-default">
                              <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#bc6746]/60 transition-all group-hover:tracking-[0.4em]">Time Signature</span>
                              <p className="text-xl text-[#4a3b32]/80 font-serif italic">{new Date(selectedSession.session_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} at {selectedSession.start_time}</p>
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
                          onClick={finalizeBooking}
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
            initial={{ opacity: 0, scale: 0.95 }}
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
