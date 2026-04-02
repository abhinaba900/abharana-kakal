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
  const [activeTab, setActiveTab] = useState<'sessions' | 'bookings'>('sessions');

  // Form State
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

  if (loading) return <div className="flex h-[60vh] items-center justify-center text-white"><Loader2 className="animate-spin mr-2" /> Loading sanctuary schedules...</div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Online Yoga</h1>
          <p className="mt-2 text-slate-400">Manage your virtual sanctuary and digital encounters.</p>
        </div>
        
        <div className="flex space-x-4">
           <button 
             onClick={() => setActiveTab('sessions')}
             className={`px-6 py-2 rounded-xl transition-all ${activeTab === 'sessions' ? 'bg-purple-500/20 text-white border border-purple-500/30' : 'text-slate-400 hover:text-white'}`}
           >
             Schedules
           </button>
           <button 
             onClick={() => setActiveTab('bookings')}
             className={`px-6 py-2 rounded-xl transition-all ${activeTab === 'bookings' ? 'bg-purple-500/20 text-white border border-purple-500/30' : 'text-slate-400 hover:text-white'}`}
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
                className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/10 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all cursor-pointer group"
              >
                <div className="rounded-full bg-white/5 p-4 group-hover:bg-purple-500/20 transition-colors">
                  <Plus className="h-8 w-8 text-white/40 group-hover:text-purple-400" />
                </div>
                <span className="mt-4 text-sm font-medium text-slate-400 group-hover:text-white">Create New Session</span>
              </GlassCard>

              {sessions.map((session) => (
                <GlassCard key={session.id} className="relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${session.booked_count >= session.capacity ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {session.booked_count} / {session.capacity}
                     </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4">{session.yoga_offerings?.title}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-slate-400">
                      <Calendar className="h-4 w-4 mr-2 text-purple-400" />
                      {new Date(session.session_date).toLocaleDateString('en-GB', { dateStyle: 'medium' })}
                    </div>
                    <div className="flex items-center text-sm text-slate-400">
                      <Clock className="h-4 w-4 mr-2 text-purple-400" />
                      {session.start_time}
                    </div>
                    <div className="flex items-center text-sm text-slate-400 truncate">
                      <LinkIcon className="h-4 w-4 mr-2 text-purple-400" />
                      <span className="truncate">{session.meeting_link || 'No link set'}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                    <div className="flex -space-x-2">
                       {[...Array(Math.min(session.booked_count, 4))].map((_, i) => (
                         <div key={i} className="h-6 w-6 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 border border-slate-900 flex items-center justify-center text-[8px] text-white">U</div>
                       ))}
                       {session.booked_count > 4 && <div className="h-6 w-6 rounded-full bg-slate-800 border border-slate-900 flex items-center justify-center text-[8px] text-white">+{session.booked_count - 4}</div>}
                    </div>
                    <button className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
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
                    <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold bg-white/5">
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Session</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Payment</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                           <p className="text-sm font-semibold text-white">{booking.user_name}</p>
                           <p className="text-xs text-slate-500">{booking.user_email}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-sm text-slate-300">{booking.yoga_sessions?.yoga_offerings?.title}</p>
                           <p className="text-[10px] text-slate-500">{booking.yoga_sessions?.session_date} @ {booking.yoga_sessions?.start_time}</p>
                        </td>
                        <td className="px-6 py-4">
                           <span className="px-2 py-1 rounded-md bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
                              {booking.booking_type}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center text-xs text-green-400">
                             <CheckCircle className="h-3 w-3 mr-1" /> Paid
                           </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-white">₹{booking.total_amount}</td>
                        <td className="px-6 py-4 text-xs text-slate-500">
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
            <GlassCard className="border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Manifest New Session</h2>
              <form onSubmit={handleCreateSession} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 uppercase tracking-widest">Yoga Offering</label>
                  <select 
                    value={formData.offering_id}
                    onChange={e => setFormData({ ...formData, offering_id: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  >
                    {offerings.map(o => <option key={o.id} value={o.id}>{o.title}</option>)}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 uppercase tracking-widest">Date</label>
                    <input 
                      type="date"
                      required
                      value={formData.session_date}
                      onChange={e => setFormData({ ...formData, session_date: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 uppercase tracking-widest">Time</label>
                    <input 
                      type="time"
                      required
                      value={formData.start_time}
                      onChange={e => setFormData({ ...formData, start_time: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400 uppercase tracking-widest">Meeting Link</label>
                  <input 
                    type="url"
                    placeholder="Zoom / Google Meet URL"
                    value={formData.meeting_link}
                    onChange={e => setFormData({ ...formData, meeting_link: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-slate-400 hover:bg-white/5 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold transition-all shadow-lg shadow-purple-500/20">Manifest</button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </div>
  );
}
