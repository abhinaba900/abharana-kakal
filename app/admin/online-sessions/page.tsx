"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { GlassCard } from '@/components/admin/GlassCard';
import { yogaService, mediaService } from '@/lib/api/client';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Trash2, 
  Users, 
  Link as LinkIcon,
  Search,
  CheckCircle,
  AlertCircle,
  Loader2,
  CalendarDays,
  ShieldCheck,
  Ban,
  X,
  CreditCard,
  Image as ImageIcon,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Calendar } from '@/components/ui/Calendar';
import { SlotSelector } from '@/components/booking/SlotSelector';
import { cn, formatDateLocal, formatTime12h } from '@/lib/utils';
import { useYogaRealtime } from '@/lib/hooks/useYogaRealtime';

// Custom Modals
import { ConfirmModal } from '@/components/admin/modals/ConfirmModal';
import { PromptModal } from '@/components/admin/modals/PromptModal';

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
  duration_minutes: number;
  cooldown_minutes: number;
  capacity: number;
  booked_count: number;
  meeting_link: string;
  is_active: boolean;
  is_blocked: boolean;
  status: string;
  blocked_reason: string | null;
  yoga_offerings: Offering;
}

interface Booking {
  id: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  booking_type: string;
  total_amount: number;
  payment_status: 'pending' | 'submitted' | 'paid' | 'failed' | 'verified';
  booking_status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  payment_reference?: string;
  payment_screenshot_url?: string;
  base_amount: number;
  gst_amount: number;
  created_at: string;
  yoga_sessions: Session;
}

export default function OnlineSessionsAdmin() {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'availability' | 'review' | 'bookings' | 'offerings' | 'payment'>('availability');
  
  // Payment Settings State
  const [paymentSettings, setPaymentSettings] = useState({
      upi_id: '',
      payee_name: '',
      instructions: '',
      qr_image_url: '',
      gst_percent: 18
  });
  
  // Selected Data for Availability Manager
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isOfferingModalOpen, setIsOfferingModalOpen] = useState(false);
  const [editingOffering, setEditingOffering] = useState<Offering | null>(null);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const [offeringForm, setOfferingForm] = useState({
    title: '',
    description: '',
    duration: '60 Mins',
    single_price: 500,
    package_5_price: 2250,
    package_10_price: 4000,
    package_15_price: 5500
  });

  const [slotForm, setSlotForm] = useState({
    offering_id: '',
    start_time: '08:00',
    duration_minutes: 60,
    cooldown_minutes: 60,
    capacity: 15,
    meeting_link: ''
  });

  // Modal System State
  const [modalState, setModalState] = useState<{
    confirm?: { isOpen: boolean; title: string; message: string; onConfirm: () => void; isDanger?: boolean; isLoading?: boolean };
    prompt?: { 
        isOpen: boolean; title: string; message: string; onConfirm: (val: string) => void; 
        type?: 'text' | 'date' | 'time'; defaultValue?: string; placeholder?: string; 
        confirmText?: string; isLoading?: boolean 
    };
  }>({
    confirm: { isOpen: false, title: '', message: '', onConfirm: () => {} },
    prompt: { isOpen: false, title: '', message: '', onConfirm: () => {} }
  });

  // Realtime Integration for the entire dashboard
  const { 
    sessions, setSessions, 
    bookings, setBookings, 
    exceptions, setExceptions 
  } = useYogaRealtime([], [], []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sessionsRes, bookingsRes, offeringsRes, paymentRes] = await Promise.all([
        yogaService.sessions.list(),
        yogaService.bookings.list(),
        yogaService.offerings.list(),
        yogaService.paymentSettings.get()
      ]);
      
      setSessions(sessionsRes.data.data.sessions || []);
      setExceptions(sessionsRes.data.data.exceptions || []);
      setBookings(bookingsRes.data.data);
      setOfferings(offeringsRes.data.data);
      if (paymentRes.data.data) setPaymentSettings(paymentRes.data.data);
      
      if (offeringsRes.data.data.length > 0) {
        setSlotForm(prev => ({ ...prev, offering_id: offeringsRes.data.data[0].id }));
      }
    } catch (err) {
      toast.error('Failed to load classes data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (bookingId: string, action: 'verify' | 'reject') => {
    setModalState(prev => ({
        ...prev,
        confirm: {
            isOpen: true,
            title: action === 'verify' ? 'Confirm Payment' : 'Reject Booking',
            message: action === 'verify' 
                ? 'Are you sure you want to verify this payment? A confirmation email will be sent to the visitor immediately.'
                : 'Are you sure you want to reject this booking? The visitor will be notified of the failure.',
            isDanger: action === 'reject',
            isLoading: false,
            onConfirm: async () => {
                setModalState(s => ({ ...s, confirm: { ...s.confirm!, isLoading: true } }));
                setActioningId(bookingId);
                try {
                    const payload = action === 'verify' 
                        ? { payment_status: 'paid', booking_status: 'confirmed' }
                        : { payment_status: 'failed', booking_status: 'rejected' };

                    await yogaService.bookings.update(bookingId, payload);
                    toast.success(action === 'verify' ? 'Booking confirmed & email sent' : 'Booking rejected');
                    fetchData();
                } catch (err) {
                    toast.error('Failed to update booking status');
                } finally {
                    setActioningId(null);
                    setModalState(s => ({ ...s, confirm: { ...s.confirm!, isOpen: false, isLoading: false } }));
                }
            }
        }
    }));
  };

  const handleCreateOffering = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingOffering) {
        await yogaService.offerings.update(editingOffering.id, offeringForm);
        toast.success('Offering updated successfully');
      } else {
        await yogaService.offerings.create(offeringForm);
        toast.success('New offering created');
      }
      setIsOfferingModalOpen(false);
      setEditingOffering(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to save offering');
    }
  };

  const handleDeleteOffering = async (id: string) => {
    setModalState(prev => ({
        ...prev,
        confirm: {
            isOpen: true,
            title: 'Delete Offering',
            message: 'This will permanently resolve this offering. Existing sessions linked to this offering may be affected.',
            isDanger: true,
            onConfirm: async () => {
                setModalState(s => ({ ...s, confirm: { ...s.confirm!, isLoading: true } }));
                try {
                    await yogaService.offerings.delete(id);
                    toast.success('Offering dissolved');
                    fetchData();
                } catch (err) {
                    toast.error('Failed to dissolve offering');
                } finally {
                    setModalState(s => ({ ...s, confirm: { ...s.confirm!, isOpen: false, isLoading: false } }));
                }
            }
        }
    }));
  };

  const isPastSlot = useMemo(() => {
    if (!selectedDate) return false;
    const now = new Date();
    const [h, m] = slotForm.start_time.split(':').map(Number);
    const checkDate = new Date(selectedDate);
    checkDate.setHours(h, m, 0, 0);
    return checkDate < now;
  }, [selectedDate, slotForm.start_time]);

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    // 1. Validation: No past slots
    if (isPastSlot) {
        return toast.warning("You cannot create a slot in the past.");
    }

    // 2. Validation: Basic Fields
    if (!slotForm.offering_id) return toast.info("Please select a class format");
    if (slotForm.capacity <= 0) return toast.info("Capacity must be at least 1");
    if (!slotForm.meeting_link.startsWith('http')) return toast.info("Enter a valid meeting URL");
    
    try {
      const dateStr = formatDateLocal(selectedDate);
      
      // 3. Validation: Prevent Duplicates (Same date, same time)
      const isDuplicate = sessions.some(s => 
          s.session_date === dateStr && 
          s.start_time === slotForm.start_time
      );

      if (isDuplicate) {
          return toast.error("A class slot at this exact time already exists.");
      }

      const payload = {
        ...slotForm,
        session_date: dateStr
      };
      await yogaService.sessions.create(payload);
      toast.success('Sanctuary slot synchronized');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create slot');
    }
  };

  const handleDeleteSession = async (id: string) => {
    setModalState(prev => ({
        ...prev,
        confirm: {
            isOpen: true,
            title: 'Remove Session Slot',
            message: 'Are you sure you want to remove this available session? Confirmed bookings for this slot will need to be cancelled manually.',
            isDanger: true,
            onConfirm: async () => {
                setModalState(s => ({ ...s, confirm: { ...s.confirm!, isLoading: true } }));
                try {
                    await yogaService.sessions.delete(id);
                    toast.success('Sanctuary slot removed');
                    fetchData();
                } catch (err) {
                    toast.error('Failed to remove slot');
                } finally {
                    setModalState(s => ({ ...s, confirm: { ...s.confirm!, isOpen: false, isLoading: false } }));
                }
            }
        }
    }));
  };

  const toggleDateLock = async () => {
    if (!selectedDate) return;
    const dateStr = formatDateLocal(selectedDate);
    const isCurrentlyBlocked = exceptions.some(e => e.exception_date === dateStr && e.is_blocked);

    try {
      if (isCurrentlyBlocked) {
        await yogaService.availability.delete(dateStr);
        toast.success('Date is now available');
      } else {
        await yogaService.availability.create({
            exception_date: dateStr,
            is_blocked: true,
            reason: 'Admin Override'
        });
        toast.success('Date has been blocked');
      }
      fetchData();
    } catch (err) {
      toast.error('Failed to update date status');
    }
  };

  // Derived data
  const activeSessions = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = formatDateLocal(selectedDate);
    const filtered = sessions.filter(s => s.session_date === dateStr);
    console.log('[DASHBOARD] Filtering sessions for:', dateStr, 'Count:', filtered.length);
    return filtered;
  }, [selectedDate, sessions]);

  const isBlocked = useMemo(() => {
    if (!selectedDate) return false;
    const dateStr = formatDateLocal(selectedDate);
    return exceptions.some(e => e.exception_date === dateStr && e.is_blocked);
  }, [selectedDate, exceptions]);

  const pendingPayments = useMemo(() => {
    return bookings.filter(b => b.payment_status === 'submitted');
  }, [bookings]);

  if (loading && offerings.length === 0) return (
    <div className="flex h-[60vh] flex-col items-center justify-center text-[#bc6746]">
        <Loader2 className="animate-spin h-8 w-8 mb-4" /> 
        <p className="text-xs font-black uppercase tracking-widest opacity-60">Synchronizing sanctuary data...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-4xl font-serif text-[#4a3b32] tracking-tighter uppercase italic">Classes Dashboard</h1>
            <p className="mt-2 text-[#a55a3d]/70 max-w-md text-sm italic">Verification, availability management, and class configuration.</p>
          </div>
          <button 
            onClick={fetchData} 
            disabled={loading}
            className="p-3 bg-white/40 backdrop-blur-md rounded-2xl border border-[#f1e4da] text-[#bc6746] hover:bg-[#bc6746]/5 transition-all shadow-sm group"
            title="Refresh Sanctuary Data"
          >
            <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
          </button>
        </div>
        
        <div className="flex p-1 bg-white/40 backdrop-blur-md rounded-2xl border border-[#f1e4da] shadow-sm overflow-hidden overflow-x-auto max-w-full">
           {['availability', 'review', 'bookings', 'offerings', 'payment'].map((tab) => (
             <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                    "px-4 md:px-5 py-2.5 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest relative whitespace-nowrap",
                    activeTab === tab ? 'bg-[#bc6746] text-white shadow-lg shadow-[#bc6746]/20' : 'text-[#a55a3d]/50 hover:text-[#bc6746] hover:bg-white/40'
                )}
             >
                {tab}
                {tab === 'review' && pendingPayments.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] flex items-center justify-center rounded-full animate-bounce shadow-md">
                        {pendingPayments.length}
                    </span>
                )}
             </button>
           ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Tab 1: Availability Manager */}
        {activeTab === 'availability' && (
          <motion.div 
            key="availability"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start"
          >
            <div className="xl:col-span-7">
               <Calendar 
                 selectedDate={selectedDate}
                 onDateSelect={setSelectedDate}
                 availabilityData={{ sessions, exceptions }}
                 isAdmin
               />
            </div>

            <div className="xl:col-span-5 space-y-8">
                <GlassCard className="border-[#bc6746]/10 p-10">
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#f1e4da]">
                        <div>
                            <h2 className="text-2xl font-serif text-[#4a3b32] uppercase tracking-tighter">
                                {selectedDate?.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
                            </h2>
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#a55a3d]/40">Control Station</p>
                        </div>
                        <CalendarDays className="w-6 h-6 text-[#bc6746]/40" />
                    </div>

                    <div className="space-y-8">
                        {/* Status Toggle */}
                        <div className={cn(
                            "p-6 rounded-[30px] border-2 transition-all flex items-center justify-between",
                            isBlocked ? "border-red-100 bg-red-50/20" : "border-green-100 bg-green-50/20"
                        )}>
                            <div className="flex items-center space-x-4">
                                {isBlocked ? (
                                    <div className="p-3 bg-red-500 rounded-2xl text-white shadow-xl shadow-red-500/20"><Ban className="w-5 h-5" /></div>
                                ) : (
                                    <div className="p-3 bg-green-500 rounded-2xl text-white shadow-xl shadow-green-500/20"><ShieldCheck className="w-5 h-5" /></div>
                                )}
                                <div>
                                    <p className="text-sm font-black text-[#4a3b32] uppercase tracking-wide">{isBlocked ? 'Date Blocked' : 'Date Available'}</p>
                                    <p className="text-[9px] text-[#a55a3d]/50 font-black uppercase tracking-widest">{isBlocked ? 'Manual Override' : 'Accepting Slots'}</p>
                                </div>
                            </div>
                            <button 
                                onClick={toggleDateLock}
                                className={cn(
                                    "px-4 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all",
                                    isBlocked ? "bg-white text-green-600 border border-green-200" : "bg-white text-red-500 border border-red-200"
                                )}
                            >
                                {isBlocked ? 'Make Available' : 'Block Date'}
                            </button>
                        </div>

                        {/* Existing Slots */}
                        {!isBlocked && (
                            <div className="space-y-5">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#a55a3d]/40 pl-1 italic">Active Time Slots</h4>
                                <div className="space-y-4">
                                    {activeSessions.length > 0 ? activeSessions.map(slot => {
                                        const now = new Date();
                                        const sessionStart = new Date(`${slot.session_date}T${slot.start_time}`);
                                        const sessionEnd = new Date(sessionStart.getTime() + (slot.duration_minutes || 60) * 60000);
                                        const isCompleted = now > sessionEnd;

                                        return (
                                        <div key={slot.id} className={cn(
                                            "flex flex-col p-6 bg-white/40 rounded-3xl border transition-all space-y-4",
                                            slot.is_blocked || slot.status === 'cancelled' ? "border-red-200 bg-red-50/10 grayscale-[0.5]" : "border-[#f1e4da] hover:bg-white/80"
                                        )}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-5">
                                                    <div className={cn(
                                                        "p-3 rounded-2xl",
                                                        slot.is_blocked ? "bg-red-500/10 text-red-500" : (isCompleted ? "bg-gray-100 text-gray-400" : "bg-[#bc6746]/5 text-[#bc6746]")
                                                    )}>
                                                        {slot.is_blocked ? <Ban className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-md font-bold text-[#4a3b32] tracking-tighter">
                                                            {formatTime12h(slot.start_time)}
                                                            {slot.is_blocked && <span className="ml-2 text-[8px] px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-black uppercase tracking-widest">Blocked</span>}
                                                            {isCompleted && !slot.is_blocked && <span className="ml-2 text-[8px] px-2 py-0.5 bg-gray-200 text-gray-500 rounded-full font-black uppercase tracking-widest">Completed</span>}
                                                        </p>
                                                        <p className="text-[10px] text-[#bc6746]/60 font-black uppercase tracking-widest">{slot.yoga_offerings?.title}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-black text-[#4a3b32]">{slot.booked_count} / {slot.capacity}</p>
                                                    <p className="text-[9px] text-[#a55a3d]/40 uppercase tracking-widest font-black italic">Bookings</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-[#f1e4da]/50">
                                                <div className="flex gap-4">
                                                    <div className="space-y-0.5">
                                                        <p className="text-[8px] text-[#a55a3d]/40 font-black uppercase tracking-widest leading-none">Duration</p>
                                                        <p className="text-[10px] font-bold text-[#4a3b32]">{slot.duration_minutes}m</p>
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <p className="text-[8px] text-[#a55a3d]/40 font-black uppercase tracking-widest leading-none">Cooldown</p>
                                                        <p className="text-[10px] font-bold text-[#4a3b32]">{slot.cooldown_minutes}m</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => {
                                                            setModalState(prev => ({
                                                                ...prev,
                                                                prompt: {
                                                                    isOpen: true,
                                                                    title: 'Reschedule Session',
                                                                    message: 'Select the new date for this sanctuary session.',
                                                                    type: 'date',
                                                                    defaultValue: slot.session_date,
                                                                    confirmText: 'Next Step',
                                                                    onConfirm: (newDate) => {
                                                                        // Step 2: Time Selection
                                                                        setModalState(s => ({
                                                                            ...s,
                                                                            prompt: {
                                                                                ...s.prompt!,
                                                                                title: 'Select Start Time',
                                                                                message: `New date: ${newDate}. Now enter the commencement time.`,
                                                                                type: 'time',
                                                                                defaultValue: slot.start_time,
                                                                                confirmText: 'Finalize',
                                                                                onConfirm: async (newTime) => {
                                                                                    setModalState(m => ({ ...m, prompt: { ...m.prompt!, isLoading: true } }));
                                                                                    try {
                                                                                        await yogaService.sessions.update(slot.id, { 
                                                                                            session_date: newDate, 
                                                                                            start_time: newTime, 
                                                                                            status: 'scheduled' 
                                                                                        });
                                                                                        toast.success('Session transitioned successfully');
                                                                                        fetchData();
                                                                                    } catch (err) {
                                                                                        toast.error('Failed to transition session');
                                                                                    } finally {
                                                                                        setModalState(m => ({ 
                                                                                            ...m, 
                                                                                            prompt: { ...m.prompt!, isOpen: false, isLoading: false } 
                                                                                        }));
                                                                                    }
                                                                                }
                                                                            }
                                                                        }));
                                                                    }
                                                                }
                                                            }));
                                                        }}
                                                        className="px-3 py-2 bg-white border border-[#f1e4da] text-[#bc6746] rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#bc6746] hover:text-white transition-all shadow-sm flex items-center gap-2"
                                                    >
                                                        <RefreshCw className="w-3 h-3" /> Reschedule
                                                    </button>
                                                    <button 
                                                        onClick={async () => {
                                                            const newBlocked = !slot.is_blocked;
                                                            if (newBlocked) {
                                                                setModalState(prev => ({
                                                                    ...prev,
                                                                    prompt: {
                                                                        isOpen: true,
                                                                        title: 'Block Session',
                                                                        message: 'Provide a reason for blocking this specific time slot.',
                                                                        defaultValue: 'Maintenance',
                                                                        onConfirm: async (reason) => {
                                                                            setModalState(s => ({ ...s, prompt: { ...s.prompt!, isLoading: true } }));
                                                                            try {
                                                                                await yogaService.sessions.update(slot.id, { is_blocked: true, blocked_reason: reason });
                                                                                toast.success('Slot blocked');
                                                                                fetchData();
                                                                            } catch (err) {
                                                                                toast.error('Failed to update slot');
                                                                            } finally {
                                                                                setModalState(s => ({ ...s, prompt: { ...s.prompt!, isOpen: false, isLoading: false } }));
                                                                            }
                                                                        }
                                                                    }
                                                                }));
                                                            } else {
                                                                try {
                                                                    await yogaService.sessions.update(slot.id, { is_blocked: false, blocked_reason: null });
                                                                    toast.success('Slot unblocked');
                                                                    fetchData();
                                                                } catch (err) {
                                                                    toast.error('Failed to update slot');
                                                                }
                                                            }
                                                        }}
                                                        className="p-3 text-[#bc6746] hover:bg-[#bc6746]/5 transition-colors bg-white rounded-xl border border-[#f1e4da] shadow-sm"
                                                    >
                                                        {slot.is_blocked ? <ShieldCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                                    </button>
                                                    <button onClick={() => handleDeleteSession(slot.id)} className="p-3 text-[#f1e4da] hover:text-red-500 transition-colors bg-white rounded-xl border border-[#f1e4da] shadow-sm">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        );
                                    }) : (
                                        <div className="text-center py-10 border-2 border-dashed border-[#f1e4da] rounded-3xl opacity-30 italic text-xs uppercase tracking-widest font-black">
                                            Empty Field
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Create Slot Form */}
                        {!isBlocked && (
                            <div className="pt-8 border-t border-[#f1e4da]">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#bc6746] pl-1 mb-6">Create New Slot</h4>
                                <form onSubmit={handleCreateSlot} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-[#a55a3d]/50 ml-2">Class Format</label>
                                            <select 
                                                value={slotForm.offering_id}
                                                onChange={e => setSlotForm({ ...slotForm, offering_id: e.target.value })}
                                                className="w-full bg-[#fffdf8] border border-[#f1e4da] rounded-2xl px-5 py-4 text-[13px] text-[#4a3b32] focus:ring-1 ring-[#bc6746] outline-none appearance-none font-serif italic"
                                            >
                                                {offerings.map(o => <option key={o.id} value={o.id}>{o.title}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-[#a55a3d]/50 ml-2">Start Hour</label>
                                            <input 
                                                type="time"
                                                value={slotForm.start_time}
                                                onChange={e => setSlotForm({ ...slotForm, start_time: e.target.value })}
                                                className="w-full bg-[#fffdf8] border border-[#f1e4da] rounded-2xl px-5 py-4 text-[13px] text-[#4a3b32] focus:ring-1 ring-[#bc6746] outline-none font-serif"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-[#a55a3d]/50 ml-2">Duration (Min)</label>
                                            <input 
                                                type="number"
                                                value={slotForm.duration_minutes}
                                                onChange={e => setSlotForm({ ...slotForm, duration_minutes: Number(e.target.value) })}
                                                className="w-full bg-[#fffdf8] border border-[#f1e4da] rounded-2xl px-5 py-4 text-[13px] text-[#4a3b32] focus:ring-1 ring-[#bc6746] outline-none font-serif"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-[#a55a3d]/50 ml-2">Cooldown (Min)</label>
                                            <input 
                                                type="number"
                                                value={slotForm.cooldown_minutes}
                                                onChange={e => setSlotForm({ ...slotForm, cooldown_minutes: Number(e.target.value) })}
                                                className="w-full bg-[#fffdf8] border border-[#f1e4da] rounded-2xl px-5 py-4 text-[13px] text-[#4a3b32] focus:ring-1 ring-[#bc6746] outline-none font-serif"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-[#a55a3d]/50 ml-2">Capacity</label>
                                            <input 
                                                type="number"
                                                value={slotForm.capacity}
                                                onChange={e => setSlotForm({ ...slotForm, capacity: Number(e.target.value) })}
                                                className="w-full bg-[#fffdf8] border border-[#f1e4da] rounded-2xl px-5 py-4 text-[13px] text-[#4a3b32] focus:ring-1 ring-[#bc6746] outline-none font-serif"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[#a55a3d]/50 ml-2">Meeting Portal Link (Zoom)</label>
                                        <input 
                                            type="url"
                                            placeholder="https://zoom.us/j/..."
                                            value={slotForm.meeting_link}
                                            onChange={e => setSlotForm({ ...slotForm, meeting_link: e.target.value })}
                                            className="w-full bg-[#fffdf8] border border-[#f1e4da] rounded-2xl px-5 py-4 text-[13px] text-[#4a3b32] focus:ring-1 ring-[#bc6746] outline-none placeholder:italic"
                                        />
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={isPastSlot}
                                        className={cn(
                                            "w-full py-5 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl transition-all flex items-center justify-center gap-3",
                                            isPastSlot ? "bg-gray-200 cursor-not-allowed text-gray-400" : "bg-[#bc6746] shadow-[#bc6746]/20 active:scale-95"
                                        )}
                                    >
                                        {isPastSlot ? <AlertCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                        {isPastSlot ? "Cannot Create Past Slot" : "Create Class Slot"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </GlassCard>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Payment Review (New) */}
        {activeTab === 'review' && (
          <motion.div 
            key="review"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
             {pendingPayments.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-32 space-y-6 opacity-30 grayscale">
                    <ShieldCheck className="w-24 h-24 text-[#bc6746]/40" />
                    <p className="text-sm font-black uppercase tracking-[0.5em] text-[#bc6746]">No Pending Verifications</p>
                 </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {pendingPayments.map(booking => (
                        <GlassCard key={booking.id} className="group relative overflow-hidden p-8 border-[#bc6746]/10 flex flex-col gap-8">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rotate-45 translate-x-16 -translate-y-16" />
                            
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-serif text-[#4a3b32] leading-none uppercase italic">{booking.user_name}</h3>
                                    <p className="text-[10px] text-[#a55a3d]/60 font-black uppercase tracking-widest">{booking.user_email}</p>
                                    {booking.user_phone && <p className="text-[9px] text-[#bc6746]/60 font-bold">{booking.user_phone}</p>}
                                </div>
                                <div className="text-right">
                                    <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-600 text-[8px] font-black uppercase tracking-widest mb-1 shadow-sm">In Review</div>
                                    <p className="text-xs font-black text-[#bc6746]">₹{booking.total_amount}</p>
                                </div>
                            </div>

                            <div className="bg-[#fffdf8] rounded-3xl p-6 border border-[#f1e4da] space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-[#bc6746] uppercase tracking-widest italic">Reference ID</p>
                                        <p className="text-sm font-serif font-black text-[#4a3b32]">{booking.payment_reference || 'N/A'}</p>
                                    </div>
                                    {booking.payment_screenshot_url && (
                                        <a href={booking.payment_screenshot_url} target="_blank" className="p-3 bg-white border border-[#f1e4da] rounded-2xl shadow-sm hover:scale-105 transition-all text-[#bc6746]">
                                            <ImageIcon className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>
                                <div className="pt-4 border-t border-[#f1e4da] space-y-1">
                                    <p className="text-[9px] font-black text-[#a55a3d]/40 uppercase tracking-widest italic">Class Destination</p>
                                    <p className="text-xs font-bold text-[#4a3b32]">{booking.yoga_sessions?.yoga_offerings?.title}</p>
                                    <p className="text-[10px] text-[#bc6746] italic font-medium">{new Date(booking.yoga_sessions?.session_date).toLocaleDateString()} @ {formatTime12h(booking.yoga_sessions?.start_time)}</p>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-auto">
                                <button 
                                  onClick={() => handleVerifyPayment(booking.id, 'reject')}
                                  disabled={actioningId === booking.id}
                                  className="flex-1 py-4 rounded-2xl border border-red-100 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-3"
                                >
                                   {actioningId === booking.id ? <RefreshCw className="w-4 h-4 animate-spin"/> : <ThumbsDown className="w-4 h-4" />} Reject
                                </button>
                                <button 
                                  onClick={() => handleVerifyPayment(booking.id, 'verify')}
                                  disabled={actioningId === booking.id}
                                  className="flex-3 py-4 flex-[2] rounded-2xl bg-green-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                   {actioningId === booking.id ? <RefreshCw className="w-4 h-4 animate-spin"/> : <ThumbsUp className="w-4 h-4" />} Verify & Confirm
                                </button>
                            </div>
                        </GlassCard>
                    ))}
                </div>
             )}
          </motion.div>
        )}

        {/* Tab 3: All Bookings History */}
        {activeTab === 'bookings' && (
          <motion.div 
            key="bookings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <GlassCard noPadding className="overflow-hidden border-[#bc6746]/10 shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#f1e4da] text-[#a55a3d]/50 text-[9px] uppercase tracking-[0.3em] font-black bg-[#bc6746]/5">
                      <th className="px-8 py-6">Client Info</th>
                      <th className="px-8 py-6">Session Context</th>
                      <th className="px-8 py-6">Status Details</th>
                      <th className="px-8 py-6 text-right font-black">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1e4da]">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-[#fdfcf6]/50 transition-colors group">
                        <td className="px-8 py-6">
                           <div className="flex items-center space-x-4">
                               <div className="w-10 h-10 rounded-2xl bg-white border border-[#f1e4da] flex items-center justify-center text-[10px] font-black text-[#bc6746] shadow-sm italic">
                                   {booking.user_name.charAt(0)}
                               </div>
                               <div>
                                   <p className="text-sm font-black text-[#4a3b32] uppercase tracking-tight">{booking.user_name}</p>
                                   <p className="text-[10px] text-[#a55a3d]/50 italic">{booking.user_email}</p>
                               </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                            <div className="flex items-center space-x-2 mb-1">
                                <CalendarIcon className="w-3.5 h-3.5 text-[#bc6746]/40" />
                                <span className="text-xs font-serif font-black text-[#4a3b32]/80">
                                    {new Date(booking.yoga_sessions?.session_date).toLocaleDateString('en-GB')}
                                </span>
                                <span className="text-xs text-[#bc6746]/20">@</span>
                                <span className="text-xs font-serif font-black text-[#4a3b32]/80">{formatTime12h(booking.yoga_sessions?.start_time)}</span>
                            </div>
                           <p className="text-[9px] text-[#bc6746]/60 uppercase tracking-[0.2em] font-black">{booking.yoga_sessions?.yoga_offerings?.title}</p>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center space-x-4">
                                <div className={cn(
                                    "flex items-center text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm",
                                    booking.payment_status === 'paid' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                                )}>
                                    {booking.payment_status === 'paid' ? 'Paid' : 'Pending'}
                                </div>
                                <div className={cn(
                                    "flex items-center text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm",
                                    booking.booking_status === 'confirmed' ? 'bg-[#bc6746] text-white shadow-xl shadow-[#bc6746]/20' : 'bg-gray-100 text-gray-400'
                                )}>
                                    {booking.booking_status}
                                </div>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <p className="text-lg font-serif font-black text-[#bc6746] italic">₹{booking.total_amount}</p>
                           <p className="text-[10px] text-[#a55a3d]/40 font-black uppercase tracking-tighter italic">Transaction Finalized</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Tab 4: Offerings Configuration */}
        {activeTab === 'offerings' && (
          <motion.div 
            key="offerings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
             {/* Create Card */}
             <GlassCard 
                onClick={() => {
                  setEditingOffering(null);
                  setOfferingForm({
                    title: '',
                    description: '',
                    duration: '60 Mins',
                    single_price: 500,
                    package_5_price: 2250,
                    package_10_price: 4000,
                    package_15_price: 5500
                  });
                  setIsOfferingModalOpen(true);
                }}
                className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-[#f1e4da] hover:border-[#bc6746]/40 hover:bg-[#bc6746]/5 hover:scale-[0.98] transition-all cursor-pointer group rounded-[50px]"
              >
                <div className="rounded-3xl bg-white border border-[#f1e4da] p-6 shadow-xl group-hover:bg-[#bc6746] group-hover:text-white transition-all duration-500">
                  <Plus className="h-10 w-10 text-[#bc6746] group-hover:text-white" />
                </div>
                <span className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-[#bc6746] opacity-60 group-hover:opacity-100">Create Offering</span>
              </GlassCard>

              {offerings.map((offering) => (
                <GlassCard key={offering.id} className="relative group overflow-hidden flex flex-col h-full rounded-[50px] p-10 hover:shadow-2xl transition-all border-[#f1e4da]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#bc6746]/5 to-transparent rounded-bl-[100px]" />
                  
                  <div className="flex justify-between items-start mb-8 relative">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-serif text-[#4a3b32] uppercase italic tracking-tighter leading-none">{offering.title}</h3>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#bc6746]/60 italic font-medium">
                            <Clock className="w-3 h-3" /> {offering.duration}
                        </div>
                    </div>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => {
                           setEditingOffering(offering);
                           setOfferingForm({
                             title: offering.title,
                             description: offering.description,
                             duration: offering.duration,
                             single_price: offering.single_price,
                             package_5_price: offering.package_5_price,
                             package_10_price: offering.package_10_price,
                             package_15_price: offering.package_15_price
                           });
                           setIsOfferingModalOpen(true);
                         }}
                         className="p-3 bg-white border border-[#f1e4da] rounded-2xl shadow-sm hover:scale-110 transition-all text-[#bc6746]"
                       >
                         <RefreshCw className="h-4 w-4" />
                       </button>
                    </div>
                  </div>
                  
                  <p className="text-xs leading-relaxed text-[#a55a3d]/70 italic line-clamp-3 mb-10 flex-grow font-medium">{offering.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <div className="bg-[#fffdf8] border border-[#f1e4da] p-4 rounded-3xl text-center shadow-sm">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#a55a3d]/40 mb-1">Standard</p>
                        <p className="text-xl font-serif font-black text-[#bc6746] tracking-tighter">₹{offering.single_price}</p>
                    </div>
                    <div className="bg-[#bc6746] p-4 rounded-3xl text-center shadow-lg shadow-[#bc6746]/20">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1">PK 5</p>
                        <p className="text-xl font-serif font-black text-white tracking-tighter">₹{offering.package_5_price}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
          </motion.div>
        )}
        {/* Tab 5: Payment Configuration */}
        {activeTab === 'payment' && (
          <motion.div 
            key="payment"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto"
          >
            <GlassCard className="p-12 border-[#bc6746]/10 space-y-12">
                <div className="flex justify-between items-center pb-6 border-b border-[#f1e4da]">
                    <div>
                        <h2 className="text-3xl font-serif text-[#4a3b32] uppercase italic tracking-tighter leading-none">Checkout Configuration</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a55a3d]/40 mt-2">Manage your collection portal</p>
                    </div>
                    <div className="p-4 bg-[#bc6746]/5 text-[#bc6746] rounded-2xl">
                        <CreditCard className="w-6 h-6" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left: QR Upload */}
                    <div className="space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a55a3d]/50 ml-2 italic">QR CODE PREVIEW</label>
                        <div className="relative group h-80 bg-[#fffdf8] rounded-[40px] border-2 border-dashed border-[#f1e4da] flex flex-col items-center justify-center space-y-4 overflow-hidden hover:border-[#bc6746]/30 transition-all">
                            {paymentSettings.qr_image_url ? (
                                <>
                                    <img src={paymentSettings.qr_image_url} alt="Payment QR" className="w-64 h-64 object-contain" />
                                    <button 
                                      onClick={() => setPaymentSettings({...paymentSettings, qr_image_url: ''})}
                                      className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-red-500"
                                    >
                                      Remove QR
                                    </button>
                                </>
                            ) : (
                                <>
                                    <ImageIcon className="w-12 h-12 text-[#bc6746]/20" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#a55a3d]/40">Click to Upload QR</p>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            try {
                                                toast.info("Uploading QR...");
                                                const res = await mediaService.upload(file, 'payment');
                                                if (res.data.success) {
                                                    setPaymentSettings({...paymentSettings, qr_image_url: res.data.url});
                                                    toast.success("QR Code updated locally. Save to finalize.");
                                                }
                                            } catch (err) {
                                                toast.error("Failed to upload image");
                                            }
                                        }}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right: Text Configuration */}
                    <div className="space-y-8">
                        <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a55a3d]/50 ml-2">UPI ID (VPA)</label>
                             <input 
                                type="text"
                                value={paymentSettings.upi_id}
                                onChange={e => setPaymentSettings({...paymentSettings, upi_id: e.target.value})}
                                placeholder="e.g. sanctuary@upi"
                                className="w-full bg-[#fffdf8] border border-[#f1e4da] rounded-2xl px-6 py-4 text-sm font-bold text-[#4a3b32] outline-none focus:border-[#bc6746]"
                             />
                        </div>
                        <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a55a3d]/50 ml-2">Payee / Account Name</label>
                             <input 
                                type="text"
                                value={paymentSettings.payee_name}
                                onChange={e => setPaymentSettings({...paymentSettings, payee_name: e.target.value})}
                                placeholder="e.g. Abharana Kakal Sanctuary"
                                className="w-full bg-[#fffdf8] border border-[#f1e4da] rounded-2xl px-6 py-4 text-sm font-bold text-[#4a3b32] outline-none focus:border-[#bc6746]"
                             />
                        </div>
                        <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a55a3d]/50 ml-2">GST Percentage (%)</label>
                             <input 
                                type="number"
                                value={paymentSettings.gst_percent}
                                onChange={e => setPaymentSettings({...paymentSettings, gst_percent: Number(e.target.value)})}
                                className="w-full bg-[#fffdf8] border border-[#f1e4da] rounded-2xl px-6 py-4 text-sm font-bold text-[#4a3b32] outline-none focus:border-[#bc6746]"
                             />
                        </div>
                        <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a55a3d]/50 ml-2">Payment Instructions (Optional)</label>
                             <textarea 
                                rows={2}
                                value={paymentSettings.instructions}
                                onChange={e => setPaymentSettings({...paymentSettings, instructions: e.target.value})}
                                placeholder="Instructions shown on payment screen..."
                                className="w-full bg-[#fffdf8] border border-[#f1e4da] rounded-3xl p-6 text-xs italic font-medium text-[#4a3b32] outline-none focus:border-[#bc6746]"
                             />
                        </div>
                        
                        <button 
                            onClick={async () => {
                                try {
                                    await yogaService.paymentSettings.update(paymentSettings);
                                    toast.success('Sanctuary checkout settings updated');
                                } catch (err) {
                                    toast.error('Failed to update settings');
                                }
                            }}
                            className="w-full py-6 bg-[#bc6746] text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.5em] shadow-[0_20px_40px_rgba(188,103,70,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            COMMIT CHANGES
                        </button>
                    </div>
                </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offering Modal - Enhanced */}
      <AnimatePresence>
        {isOfferingModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#4a3b32]/80 backdrop-blur-2xl">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="w-full max-w-2xl">
              <GlassCard className="border-[#bc6746]/20 p-12 shadow-[0_50px_100px_rgba(0,0,0,0.3)] rounded-[60px] overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-transparent via-[#bc6746] to-transparent" />
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-4xl font-serif text-[#4a3b32] uppercase italic tracking-tighter">{editingOffering ? 'Evolve Offering' : 'New Creation'}</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#a55a3d]/40 mt-2">Class Logic Configuration</p>
                    </div>
                    <button onClick={() => setIsOfferingModalOpen(false)} className="p-4 border border-[#f1e4da] rounded-2xl hover:bg-[#bc6746]/5 transition-all"><X className="w-6 h-6 text-[#4a3b32]" /></button>
                </div>

                <form onSubmit={handleCreateOffering} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a55a3d]/50 ml-2">Class Title</label>
                      <input type="text" required placeholder="e.g. Lunar Hatha Flow" value={offeringForm.title} onChange={e => setOfferingForm({ ...offeringForm, title: e.target.value })} className="w-full bg-[#fffdf8] border-b border-[#f1e4da] px-2 py-4 text-2xl font-serif italic text-[#4a3b32] focus:border-[#bc6746] outline-none transition-all placeholder:text-[#bc6746]/10"/>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a55a3d]/50 ml-2">Temporal Pulse</label>
                       <input type="text" required placeholder="e.g. 75 Mins" value={offeringForm.duration} onChange={e => setOfferingForm({ ...offeringForm, duration: e.target.value })} className="w-full bg-[#fffdf8] border-b border-[#f1e4da] px-2 py-4 text-2xl font-serif italic text-[#4a3b32] focus:border-[#bc6746] outline-none transition-all placeholder:text-[#bc6746]/10"/>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a55a3d]/50 ml-2">Intrinsic Description</label>
                    <textarea rows={2} required placeholder="What essence does this practice carry?" value={offeringForm.description} onChange={e => setOfferingForm({ ...offeringForm, description: e.target.value })} className="w-full bg-[#fffdf8] border border-[#f1e4da] rounded-[30px] p-6 text-md italic font-medium text-[#4a3b32] focus:border-[#bc6746] outline-none transition-all placeholder:text-[#bc6746]/10"/>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {['single_price', 'package_5_price', 'package_10_price', 'package_15_price'].map((field) => (
                        <div key={field} className="space-y-2">
                           <label className="text-[8px] font-black uppercase tracking-widest text-[#a55a3d]/50 ml-1">
                               {field === 'single_price' ? 'Standard' : `PK ${field.split('_')[1]}`}
                           </label>
                           <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bc6746]/40 font-bold">₹</span>
                            <input type="number" required value={(offeringForm as any)[field]} onChange={e => setOfferingForm({ ...offeringForm, [field]: Number(e.target.value) })} className="w-full bg-[#fffdf8] border border-[#f1e4da] rounded-2xl px-4 pl-9 py-4 font-serif font-black text-[#bc6746] outline-none focus:border-[#bc6746] transition-all"/>
                          </div>
                        </div>
                    ))}
                  </div>

                  <div className="flex space-x-6 pt-10">
                    <button type="submit" className="flex-1 py-6 rounded-3xl bg-[#bc6746] text-white text-[11px] font-black uppercase tracking-[0.5em] transition-all shadow-[0_20px_40px_rgba(188,103,70,0.3)] hover:scale-[1.02] active:scale-95">
                        {editingOffering ? 'Verified Update' : 'Initialize Creation'}
                    </button>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CUSTOM MODALS */}
      {/* Custom Modals Portal */}
      {modalState.confirm?.isOpen && (
        <ConfirmModal 
          isOpen={modalState.confirm.isOpen}
          title={modalState.confirm.title}
          message={modalState.confirm.message}
          variant={modalState.confirm.isDanger ? 'danger' : 'info'}
          isLoading={modalState.confirm.isLoading}
          onConfirm={modalState.confirm.onConfirm}
          onClose={() => setModalState(prev => ({ 
            ...prev, 
            confirm: { ...prev.confirm!, isOpen: false } 
          }))}
        />
      )}

      {modalState.prompt?.isOpen && (
        <PromptModal 
          isOpen={modalState.prompt.isOpen}
          title={modalState.prompt.title}
          message={modalState.prompt.message}
          type={modalState.prompt.type}
          defaultValue={modalState.prompt.defaultValue}
          placeholder={modalState.prompt.placeholder}
          confirmText={modalState.prompt.confirmText}
          isLoading={modalState.prompt.isLoading}
          onConfirm={modalState.prompt.onConfirm}
          onClose={() => setModalState(prev => ({ 
            ...prev, 
            prompt: { ...prev.prompt!, isOpen: false } 
          }))}
        />
      )}
    </div>
  );
}
