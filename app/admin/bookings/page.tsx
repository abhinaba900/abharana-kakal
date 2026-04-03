"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { GlassCard } from '@/components/admin/GlassCard';
import { bookingService } from '@/lib/api/client';
import { 
  Search,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  CreditCard,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Filter,
  User,
  Mail,
  Phone,
  Tag,
  Clock,
  Calendar
} from 'lucide-react';
import { toast } from 'react-toastify';
import { cn, formatDateLocal } from '@/lib/utils';
import { ConfirmModal } from '@/components/admin/modals/ConfirmModal';

interface Booking {
  id: string;
  booking_type: 'yoga' | 'upcoming' | 'retreat';
  reference_id: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  total_amount: number;
  payment_status: 'pending' | 'submitted' | 'verified' | 'failed' | 'paid';
  booking_status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  payment_reference?: string;
  payment_screenshot_url?: string;
  created_at: string;
  metadata?: any;
}

export default function BookingsAdmin() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  const [modalState, setModalState] = useState<{
    confirm?: { isOpen: boolean; title: string; message: string; onConfirm: () => void; isDanger?: boolean; isLoading?: boolean };
  }>({
    confirm: { isOpen: false, title: '', message: '', onConfirm: () => {} }
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingService.list();
      setBookings(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, action: 'verify' | 'reject') => {
    setModalState({
      confirm: {
        isOpen: true,
        title: action === 'verify' ? 'Verify Payment' : 'Reject Booking',
        message: action === 'verify' 
          ? 'Confirm that the payment has been received. This will notify the user and confirm the booking.'
          : 'Are you sure you want to reject this booking? The user will be notified of the payment failure.',
        isDanger: action === 'reject',
        isLoading: false,
        onConfirm: async () => {
          setModalState(s => ({ ...s, confirm: { ...s.confirm!, isLoading: true } }));
          try {
            const payload = action === 'verify' 
              ? { payment_status: 'verified', booking_status: 'confirmed' }
              : { payment_status: 'failed', booking_status: 'rejected' };

            // Ensure legacy records are updated in the correct table
            const updatePayload = (bookings.find(b => b.id === bookingId) as any)?.is_legacy 
                ? { ...payload, is_legacy: true } 
                : payload;

            await bookingService.update(bookingId, updatePayload);
            toast.success(action === 'verify' ? 'Booking verified successfully' : 'Booking rejected');
            fetchBookings();
            if (selectedBooking?.id === bookingId) setSelectedBooking(null);
          } catch (err) {
            toast.error('Failed to update booking');
          } finally {
            setModalState(s => ({ ...s, confirm: { ...s.confirm!, isOpen: false, isLoading: false } }));
          }
        }
      }
    });
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesType = filterType === 'all' || b.booking_type === filterType;
      const matchesStatus = filterStatus === 'all' || b.payment_status === filterStatus;
      const matchesSearch = 
        b.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.payment_reference?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [bookings, filterType, filterStatus, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.payment_status === 'submitted').length,
      verified: bookings.filter(b => (b.payment_status as string) === 'verified' || (b.payment_status as string) === 'paid').length,
      yoga: bookings.filter(b => b.booking_type === 'yoga').length,
      upcoming: bookings.filter(b => b.booking_type === 'upcoming').length,
      retreat: bookings.filter(b => b.booking_type === 'retreat').length,
    };
  }, [bookings]);

  return (
    <div className="min-h-screen bg-[#faf8f6] p-8 pb-24">
      {/* Header Section */}
      <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-[#4a3b32] md:text-5xl">
            Bookings <span className="font-serif italic text-[#bc6746]">Sanctuary</span>
          </h1>
          <p className="mt-2 text-[#4a3b32]/60">Manage all module payments and attendance in one place.</p>
        </div>
        
        <button 
          onClick={fetchBookings}
          className="group flex items-center space-x-2 rounded-full border border-[#bc6746]/20 bg-white px-6 py-3 text-[#bc6746] shadow-sm transition-all hover:bg-[#bc6746] hover:text-white"
        >
          <RefreshCw className={cn("h-4 w-4 transition-transform group-hover:rotate-180", loading && "animate-spin")} />
          <span className="text-sm font-medium">Refresh Data</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Yoga Bookings', value: stats.yoga, icon: Tag, color: 'text-[#bc6746]', bg: 'bg-[#bc6746]/10' },
          { label: 'Upcoming / Retreats', value: stats.upcoming + stats.retreat, icon: Calendar, color: 'text-stone-600', bg: 'bg-stone-100' },
          { label: 'Total Volume', value: `₹${bookings.reduce((acc, curr) => acc + curr.total_amount, 0).toLocaleString()}`, icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-6">
            <div className="flex items-center space-x-4">
              <div className={cn("rounded-2xl p-3", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <div>
                <p className="text-sm font-medium text-[#4a3b32]/60">{stat.label}</p>
                <p className="text-2xl font-bold text-[#4a3b32]">{stat.value}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Filters & Search */}
      <GlassCard className="mb-8 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4a3b32]/40" />
            <input 
              type="text"
              placeholder="Search user, email or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border-none bg-[#fdfaf8] py-3 pl-11 pr-6 text-sm text-[#4a3b32] placeholder-[#4a3b32]/30 ring-1 ring-[#bc6746]/10 transition-shadow focus:ring-2 focus:ring-[#bc6746]/30 outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2 rounded-full border border-[#bc6746]/10 bg-[#fdfaf8] px-4 py-1">
              <Filter className="h-3 w-3 text-[#bc6746]" />
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-transparent text-xs font-medium text-[#4a3b32] outline-none"
              >
                <option value="all">Everywhere</option>
                <option value="yoga">Online Yoga</option>
                <option value="upcoming">Gatherings</option>
                <option value="retreat">Retreats</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 rounded-full border border-[#bc6746]/10 bg-[#fdfaf8] px-4 py-1">
              <span className="text-[10px] uppercase tracking-wider text-[#4a3b32]/40">Status</span>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent text-xs font-medium text-[#4a3b32] outline-none"
              >
                <option value="all">All Payments</option>
                <option value="submitted">Submitted (Review)</option>
                <option value="verified">Verified</option>
                <option value="pending">Awaiting Proof</option>
                <option value="failed">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Main Content Area */}
      <div className="flex flex-col gap-8 lg:flex-row lg:h-[calc(100vh-420px)] overflow-hidden">
        {/* Bookings List */}
        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar will-change-transform overscroll-contain">
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 pb-12">
            {loading ? (
              <div className="flex h-64 flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#bc6746]" />
                <p className="text-sm text-[#4a3b32]/40 italic">Syncing with Sanctuary records...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center space-y-4 rounded-3xl border-2 border-dashed border-[#bc6746]/10 bg-white/40">
                <Search className="h-12 w-12 text-[#bc6746]/10" />
                <p className="text-[#4a3b32]/40 italic">No bookings found matching your filters.</p>
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <GlassCard
                  key={booking.id}
                  variant="static"
                  onClick={() => setSelectedBooking(booking)}
                  className={cn(
                    "cursor-pointer p-0 rounded-[2rem] transition-all duration-300 flex flex-col h-full",
                    selectedBooking?.id === booking.id 
                      ? "ring-2 ring-[#bc6746] bg-white shadow-2xl" 
                      : "border-transparent hover:shadow-xl"
                  )}
                >
                  <div className="flex flex-col gap-4 p-6 h-full">
                    {/* Header: Type & Date */}
                    <div className="flex items-center justify-between">
                         <span className={cn(
                            "text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full",
                            booking.booking_type === 'yoga' ? "bg-amber-100 text-amber-700" : booking.booking_type === 'upcoming' ? "bg-emerald-100 text-emerald-700" : "bg-purple-100 text-purple-700"
                         )}>
                            {booking.booking_type}
                         </span>
                         <span className="text-[10px] text-[#4a3b32]/30">{formatDateLocal(new Date(booking.created_at))}</span>
                    </div>

                    {/* Content: Main Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate text-lg font-bold text-[#4a3b32]">{booking.user_name}</h3>
                      <div className="mt-1 flex flex-col gap-1 text-[10px] text-[#4a3b32]/50">
                          <span className="flex items-center truncate"><Mail className="mr-1 h-3 w-3" /> {booking.user_email}</span>
                          {booking.user_phone && <span className="flex items-center"><Phone className="mr-1 h-3 w-3" /> {booking.user_phone}</span>}
                      </div>
                    </div>

                    {/* Footer: Amount & Status */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#f1e4da]/50">
                      <p className="text-lg font-bold text-[#bc6746]">₹{booking.total_amount}</p>
                      <div className={cn(
                          "flex items-center text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full",
                          (booking.payment_status === 'verified' || booking.payment_status === 'paid') ? "bg-emerald-50 text-emerald-600" : 
                          booking.payment_status === 'submitted' ? "bg-amber-50 text-amber-600" : 
                          booking.payment_status === 'failed' ? "bg-red-50 text-red-600" :
                          "bg-stone-50 text-stone-400"
                      )}>
                          {(booking.payment_status === 'verified' || booking.payment_status === 'paid') && <CheckCircle className="mr-1 h-3 w-3" />}
                          {booking.payment_status === 'submitted' && <Clock className="mr-1 h-3 w-3" />}
                          {booking.payment_status === 'failed' && <AlertCircle className="mr-1 h-3 w-3" />}
                          {booking.payment_status}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </div>

        {/* Details Panel (Desktop) */}
          {selectedBooking ? (
            <div 
              className="w-full lg:w-96 overflow-y-auto pr-1 overscroll-contain will-change-transform"
            >
              <GlassCard className="sticky top-0 overflow-hidden p-0 border-[#bc6746]/10">
                {/* Panel Header */}
                <div className="bg-[#bc6746]/5 p-6 flex items-center justify-between">
                   <h4 className="font-bold text-[#bc6746]">Booking Details</h4>
                   <button onClick={() => setSelectedBooking(null)} className="rounded-full p-2 hover:bg-[#bc6746]/10 text-[#bc6746]">
                      <X className="h-4 w-4" />
                   </button>
                </div>

                <div className="p-8 space-y-8">
                   {/* Payment Proof */}
                   <div>
                       <p className="text-[10px] uppercase font-bold tracking-widest text-[#4a3b32]/40 mb-3">Payment Proof</p>
                       {selectedBooking.payment_screenshot_url ? (
                           <div className="relative aspect-[3/4] group overflow-hidden rounded-3xl ring-1 ring-[#bc6746]/10">
                              <img 
                                src={selectedBooking.payment_screenshot_url} 
                                alt="Payment Proof" 
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                 <a 
                                    href={selectedBooking.payment_screenshot_url} 
                                    target="_blank" 
                                    className="flex items-center space-x-2 text-white text-xs font-medium"
                                 >
                                    <ExternalLink className="h-3 w-3" />
                                    <span>Expand Image</span>
                                 </a>
                              </div>
                           </div>
                       ) : (
                           <div className="flex aspect-square flex-col items-center justify-center rounded-3xl bg-[#4a3b32]/5 border border-dashed border-[#4a3b32]/10">
                              <AlertCircle className="h-8 w-8 text-[#4a3b32]/20 mb-2" />
                              <p className="text-[10px] text-[#4a3b32]/40">No screenshot provided.</p>
                           </div>
                       )}
                   </div>

                   {/* Reference Details */}
                   <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[#4a3b32]/40">Reference Code</span>
                            <span className="text-xs font-mono font-bold text-[#bc6746] bg-[#bc6746]/5 px-2 py-1 rounded-md">
                                {selectedBooking.payment_reference || 'MANUAL_ENTRY'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between border-t border-[#f1e4da] pt-4">
                            <span className="text-xs text-[#4a3b32]/40">GST (Include)</span>
                            <span className="text-xs font-medium text-[#4a3b32]">Included in total</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-[#f1e4da] pb-4">
                            <span className="text-xs text-[#4a3b32]/40">Total Settled</span>
                            <span className="text-lg font-bold text-[#bc6746]">₹{selectedBooking.total_amount}</span>
                        </div>
                   </div>

                   {/* Actions */}
                   {selectedBooking.payment_status === 'submitted' && (
                       <div className="grid grid-cols-2 gap-4">
                           <button 
                             onClick={() => handleUpdateStatus(selectedBooking.id, 'reject')}
                             className="flex items-center justify-center space-x-2 rounded-2xl border border-red-100 py-4 text-xs font-bold text-red-500 transition-all hover:bg-red-50"
                           >
                               <ThumbsDown className="h-4 w-4" />
                               <span>Reject</span>
                           </button>
                           <button 
                             onClick={() => handleUpdateStatus(selectedBooking.id, 'verify')}
                             className="flex items-center justify-center space-x-2 rounded-2xl bg-emerald-500 py-4 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600"
                           >
                               <ThumbsUp className="h-4 w-4" />
                               <span>Verify</span>
                           </button>
                       </div>
                   )}

                   {(selectedBooking.payment_status === 'verified' || selectedBooking.payment_status === 'paid') && (
                       <div className="flex items-center justify-center space-x-2 rounded-3xl bg-[#bc6746]/10 py-4 text-xs font-bold text-[#bc6746]">
                           <ShieldCheck className="h-4 w-4" />
                           <span>This booking is verified</span>
                       </div>
                   )}
                </div>
              </GlassCard>
            </div>
          ) : (
            <div className="hidden lg:block w-96">
                <div className="sticky top-0 rounded-3xl border-2 border-dashed border-[#bc6746]/10 bg-white/20 p-12 text-center">
                    <User className="mx-auto h-12 w-12 text-[#bc6746]/10 mb-4" />
                    <p className="text-xs italic text-[#4a3b32]/30 leading-relaxed">
                        Select a booking record from the list to view full payment documentation and settlement actions.
                    </p>
                </div>
            </div>
          )}
      </div>

      <ConfirmModal 
          {...modalState.confirm!} 
          onClose={() => setModalState(s => ({ ...s, confirm: { ...s.confirm!, isOpen: false } }))} 
      />
    </div>
  );
}

function ShieldCheck(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}
