"use client";

import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/admin/GlassCard';
import { yogaService } from '@/lib/api/client';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Users, 
  Link as LinkIcon,
  Search,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

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
  is_active: boolean;
  yoga_offerings: Offering;
}

interface Booking {
  id: string;
  user_name: string;
  user_email: string;
  booking_type: string;
  total_amount: number;
  payment_status: string;
  created_at: string;
  yoga_sessions: Session;
}

export default function OnlineSessionsAdmin() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'sessions' | 'bookings' | 'offerings'>('sessions');
  const [isOfferingModalOpen, setIsOfferingModalOpen] = useState(false);
  const [editingOffering, setEditingOffering] = useState<Offering | null>(null);

  const [offeringForm, setOfferingForm] = useState({
    title: '',
    description: '',
    duration: '60 Mins',
    single_price: 500,
    package_5_price: 2250,
    package_10_price: 4000,
    package_15_price: 5500
  });

  const [formData, setFormData] = useState({
    offering_id: '',
    session_date: '',
    start_time: '',
    capacity: 15,
    meeting_link: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sessionsRes, bookingsRes, offeringsRes] = await Promise.all([
        yogaService.sessions.list(),
        yogaService.bookings.list(),
        yogaService.offerings.list()
      ]);
      setSessions(sessionsRes.data.data);
      setBookings(bookingsRes.data.data);
      setOfferings(offeringsRes.data.data);
      if (offeringsRes.data.data.length > 0) {
        setFormData(prev => ({ ...prev, offering_id: offeringsRes.data.data[0].id }));
      }
    } catch (err) {
      toast.error('Failed to load sanctuary data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOffering = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingOffering) {
        await yogaService.offerings.update(editingOffering.id, offeringForm);
        toast.success('Offering updated in the digital scrolls');
      } else {
        await yogaService.offerings.create(offeringForm);
        toast.success('New practice manifested');
      }
      setIsOfferingModalOpen(false);
      setEditingOffering(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to manifest offering');
    }
  };

  const handleDeleteOffering = async (id: string) => {
    if (!window.confirm('Dissolve this practice from the sanctuary?')) return;
    try {
      await yogaService.offerings.delete(id);
      toast.success('Offering dissolved');
      fetchData();
    } catch (err) {
      toast.error('Failed to dissolve offering');
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await yogaService.sessions.create(formData);
      toast.success('Session manifested in the schedule');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to manifest session');
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (!window.confirm('Cancel this scheduled encounter?')) return;
    try {
      await yogaService.sessions.delete(id);
      toast.success('Session cancelled');
      fetchData();
    } catch (err) {
      toast.error('Failed to cancel session');
    }
  };

  if (loading) return <div className="flex h-[60vh] items-center justify-center text-[#bc6746]"><Loader2 className="animate-spin mr-2" /> Loading sanctuary schedules...</div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[#4a3b32]">Online Yoga</h1>
          <p className="mt-2 text-[#a55a3d]/70">Manage your virtual sanctuary and digital encounters.</p>
        </div>
        
        <div className="flex space-x-4">
           <button 
             onClick={() => setActiveTab('sessions')}
             className={`px-6 py-2 rounded-xl transition-all font-bold ${activeTab === 'sessions' ? 'bg-[#bc6746] text-white shadow-lg' : 'text-[#a55a3d]/50 hover:text-[#bc6746]'}`}
           >
             Schedules
           </button>
           <button 
             onClick={() => setActiveTab('offerings')}
             className={`px-6 py-2 rounded-xl transition-all font-bold ${activeTab === 'offerings' ? 'bg-[#bc6746] text-white shadow-lg' : 'text-[#a55a3d]/50 hover:text-[#bc6746]'}`}
           >
             Offerings
           </button>
           <button 
             onClick={() => setActiveTab('bookings')}
             className={`px-6 py-2 rounded-xl transition-all font-bold ${activeTab === 'bookings' ? 'bg-[#bc6746] text-white shadow-lg' : 'text-[#a55a3d]/50 hover:text-[#bc6746]'}`}
           >
             Bookings
           </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'sessions' ? (
          <motion.div 
            key="sessions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Add New Session Card */}
              <GlassCard 
                onClick={() => setIsModalOpen(true)}
                className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-[#f1e4da] hover:border-[#bc6746]/30 hover:bg-[#bc6746]/5 transition-all cursor-pointer group"
              >
                <div className="rounded-full bg-[#bc6746]/5 p-4 group-hover:bg-[#bc6746]/20 transition-colors">
                  <Plus className="h-8 w-8 text-[#bc6746]/40 group-hover:text-[#bc6746]" />
                </div>
                <span className="mt-4 text-sm font-medium text-[#a55a3d]/50 group-hover:text-[#bc6746]">Manifest New Session</span>
              </GlassCard>

              {sessions.map((session) => (
                <GlassCard key={session.id} className="relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${session.booked_count >= session.capacity ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {session.booked_count} / {session.capacity}
                     </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#4a3b32] mb-4">{session.yoga_offerings?.title}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-[#a55a3d]/70">
                      <Calendar className="h-4 w-4 mr-2 text-[#bc6746]" />
                      {new Date(session.session_date).toLocaleDateString('en-GB', { dateStyle: 'medium' })}
                    </div>
                    <div className="flex items-center text-sm text-[#a55a3d]/70">
                      <Clock className="h-4 w-4 mr-2 text-[#bc6746]" />
                      {session.start_time}
                    </div>
                    <div className="flex items-center text-sm text-[#a55a3d]/70 truncate">
                      <LinkIcon className="h-4 w-4 mr-2 text-[#bc6746]" />
                      <span className="truncate">{session.meeting_link || 'No link set'}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-[#f1e4da] flex justify-between items-center">
                    <div className="flex -space-x-2">
                       {[...Array(Math.min(session.booked_count, 4))].map((_, i) => (
                         <div key={i} className="h-6 w-6 rounded-full bg-[#bc6746]/20 border border-white flex items-center justify-center text-[8px] text-[#bc6746]">U</div>
                       ))}
                       {session.booked_count > 4 && <div className="h-6 w-6 rounded-full bg-[#f1e4da] border border-white flex items-center justify-center text-[8px] text-[#4a3b32]">+{session.booked_count - 4}</div>}
                    </div>
                    <button onClick={() => handleDeleteSession(session.id)} className="text-[#a55a3d]/50 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        ) : activeTab === 'offerings' ? (
          <motion.div 
            key="offerings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-[#f1e4da] hover:border-[#bc6746]/30 hover:bg-[#bc6746]/5 transition-all cursor-pointer group"
              >
                <div className="rounded-full bg-[#bc6746]/5 p-4 group-hover:bg-[#bc6746]/20 transition-colors">
                  <Plus className="h-8 w-8 text-[#bc6746]/40 group-hover:text-[#bc6746]" />
                </div>
                <span className="mt-4 text-sm font-medium text-[#a55a3d]/50 group-hover:text-[#bc6746]">Create New Practice</span>
              </GlassCard>

              {offerings.map((offering) => (
                <GlassCard key={offering.id} className="relative group overflow-hidden flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-[#4a3b32]">{offering.title}</h3>
                    <div className="flex space-x-2">
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
                         className="text-[#bc6746] hover:text-[#a55a3d]"
                       >
                         <Search className="h-4 w-4" />
                       </button>
                       <button onClick={() => handleDeleteOffering(offering.id)} className="text-[#a55a3d]/50 hover:text-red-500">
                         <Trash2 className="h-4 w-4" />
                       </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-[#a55a3d]/70 line-clamp-3 mb-6 flex-grow">{offering.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-[10px] uppercase tracking-widest font-bold">
                    <div className="bg-[#bc6746]/5 p-2 rounded-lg text-[#bc6746]">Single: ₹{offering.single_price}</div>
                    <div className="bg-[#bc6746]/5 p-2 rounded-lg text-[#bc6746]">Pkg 5: ₹{offering.package_5_price}</div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="bookings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <GlassCard noPadding>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#f1e4da] text-[#a55a3d]/70 text-[10px] uppercase tracking-[0.2em] font-bold bg-[#bc6746]/5">
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Session</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Payment</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1e4da]">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-[#bc6746]/5 transition-colors group">
                        <td className="px-6 py-4">
                           <p className="text-sm font-semibold text-[#4a3b32]">{booking.user_name}</p>
                           <p className="text-xs text-[#a55a3d]/50">{booking.user_email}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-sm text-[#4a3b32]/80">{booking.yoga_sessions?.yoga_offerings?.title}</p>
                           <p className="text-[10px] text-[#a55a3d]/50">{booking.yoga_sessions?.session_date} @ {booking.yoga_sessions?.start_time}</p>
                        </td>
                        <td className="px-6 py-4">
                           <span className="px-3 py-1 rounded-full bg-[#bc6746]/10 text-[#bc6746] text-[10px] font-bold uppercase tracking-wider">
                              {booking.booking_type}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center text-xs text-green-600 font-bold">
                             <CheckCircle className="h-3 w-3 mr-1" /> Paid
                           </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-[#4a3b32]">₹{booking.total_amount}</td>
                        <td className="px-6 py-4 text-xs text-[#a55a3d]/50">
                           {new Date(booking.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for creating session */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg"
          >
            <GlassCard className="border border-[#f1e4da] p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-[#4a3b32] mb-6">Manifest New Session</h2>
              <form onSubmit={handleCreateSession} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-[#a55a3d]/70 uppercase tracking-widest">Yoga Offering</label>
                  <select 
                    value={formData.offering_id}
                    onChange={e => setFormData({ ...formData, offering_id: e.target.value })}
                    className="w-full bg-[#fffdf8] border border-[#f1e4da] rounded-xl px-4 py-3 text-[#4a3b32] focus:outline-none focus:border-[#bc6746]"
                  >
                    {offerings.map(o => <option key={o.id} value={o.id}>{o.title}</option>)}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-[#a55a3d]/70 uppercase tracking-widest">Date</label>
                    <input 
                      type="date"
                      required
                      value={formData.session_date}
                      onChange={e => setFormData({ ...formData, session_date: e.target.value })}
                      className="w-full bg-[#fffdf8] border border-[#f1e4da] rounded-xl px-4 py-3 text-[#4a3b32] focus:outline-none focus:border-[#bc6746]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#a55a3d]/70 uppercase tracking-widest">Time</label>
                    <input 
                      type="time"
                      required
                      value={formData.start_time}
                      onChange={e => setFormData({ ...formData, start_time: e.target.value })}
                      className="w-full bg-[#fffdf8] border border-[#f1e4da] rounded-xl px-4 py-3 text-[#4a3b32] focus:outline-none focus:border-[#bc6746]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-[#a55a3d]/70 uppercase tracking-widest">Meeting Link</label>
                  <input 
                    type="url"
                    placeholder="Zoom / Google Meet URL"
                    value={formData.meeting_link}
                    onChange={e => setFormData({ ...formData, meeting_link: e.target.value })}
                    className="w-full bg-[#fffdf8] border border-[#f1e4da] rounded-xl px-4 py-3 text-[#4a3b32] focus:outline-none focus:border-[#bc6746]"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 rounded-xl border border-[#f1e4da] text-[#a55a3d]/70 hover:bg-[#bc6746]/5 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 px-6 py-3 rounded-xl bg-[#bc6746] text-white font-bold transition-all shadow-lg shadow-[#bc6746]/20">Manifest</button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      )}
      {/* Modal for creating offering */}
      {isOfferingModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl">
            <GlassCard className="border border-[#f1e4da] p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-[#4a3b32] mb-6">{editingOffering ? 'Update Practice' : 'Manifest New Practice'}</h2>
              <form onSubmit={handleCreateOffering} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-[#a55a3d]/70 uppercase tracking-widest">Title</label>
                    <input 
                      type="text"
                      required
                      value={offeringForm.title}
                      onChange={e => setOfferingForm({ ...offeringForm, title: e.target.value })}
                      className="w-full bg-[#fffdf8] border border-[#f1e4da] rounded-xl px-4 py-3 text-[#4a3b32] focus:outline-none focus:border-[#bc6746]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#a55a3d]/70 uppercase tracking-widest">Duration</label>
                    <input 
                      type="text"
                      required
                      value={offeringForm.duration}
                      onChange={e => setOfferingForm({ ...offeringForm, duration: e.target.value })}
                      className="w-full bg-[#fffdf8] border border-[#f1e4da] rounded-xl px-4 py-3 text-[#4a3b32] focus:outline-none focus:border-[#bc6746]"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-[#a55a3d]/70 uppercase tracking-widest">Description</label>
                  <textarea 
                    rows={3}
                    required
                    value={offeringForm.description}
                    onChange={e => setOfferingForm({ ...offeringForm, description: e.target.value })}
                    className="w-full bg-[#fffdf8] border border-[#f1e4da] rounded-xl px-4 py-3 text-[#4a3b32] focus:outline-none focus:border-[#bc6746]"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-[#a55a3d]/70 uppercase tracking-widest text-[9px]">Single ₹</label>
                    <input type="number" required value={offeringForm.single_price} onChange={e => setOfferingForm({ ...offeringForm, single_price: Number(e.target.value) })} className="w-full bg-[#fffdf8] border border-[#f1e4da] rounded-xl px-2 py-3 text-[#4a3b32]"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#a55a3d]/70 uppercase tracking-widest text-[9px]">Pkg 5 ₹</label>
                    <input type="number" required value={offeringForm.package_5_price} onChange={e => setOfferingForm({ ...offeringForm, package_5_price: Number(e.target.value) })} className="w-full bg-[#fffdf8] border border-[#f1e4da] rounded-xl px-2 py-3 text-[#4a3b32]"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#a55a3d]/70 uppercase tracking-widest text-[9px]">Pkg 10 ₹</label>
                    <input type="number" required value={offeringForm.package_10_price} onChange={e => setOfferingForm({ ...offeringForm, package_10_price: Number(e.target.value) })} className="w-full bg-[#fffdf8] border border-[#f1e4da] rounded-xl px-2 py-3 text-[#4a3b32]"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#a55a3d]/70 uppercase tracking-widest text-[9px]">Pkg 15 ₹</label>
                    <input type="number" required value={offeringForm.package_15_price} onChange={e => setOfferingForm({ ...offeringForm, package_15_price: Number(e.target.value) })} className="w-full bg-[#fffdf8] border border-[#f1e4da] rounded-xl px-2 py-3 text-[#4a3b32]"/>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button type="button" onClick={() => setIsOfferingModalOpen(false)} className="flex-1 px-6 py-3 rounded-xl border border-[#f1e4da] text-[#a55a3d]/70 hover:bg-[#bc6746]/5 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 px-6 py-3 rounded-xl bg-[#bc6746] text-white font-bold transition-all shadow-lg shadow-[#bc6746]/20">{editingOffering ? 'Update' : 'Manifest'}</button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      )}

    </div>
  );
}
