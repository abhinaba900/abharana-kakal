'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { GlassCard } from '@/components/admin/GlassCard';
import { enquiryService } from '@/lib/api/client';
import { 
  MessageSquare, 
  Trash2, 
  CheckCircle, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Eye,
  X,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { ConfirmModal } from '@/components/admin/modals/ConfirmModal';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  interest?: string;
  message: string;
  status: 'pending' | 'read' | 'resolved';
  created_at: string;
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    id: string;
    isLoading: boolean;
  }>({ isOpen: false, id: '', isLoading: false });
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchEnquiries();
  }, []);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id && enquiries.length > 0) {
      const enquiry = enquiries.find(e => e.id === id);
      if (enquiry) {
        setSelectedEnquiry(enquiry);
      }
    }
  }, [enquiries, searchParams]);

  const fetchEnquiries = async () => {
    try {
      const response = await enquiryService.list();
      setEnquiries(response.data.data);
    } catch (err) {
      toast.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

const [isUpdating, setIsUpdating] = useState(false);

  const updateStatus = async (id: string, status: string) => {
    setIsUpdating(true);
    try {
      await enquiryService.update(id, { status });
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: status as any } : e));
      if (selectedEnquiry?.id === id) setSelectedEnquiry({ ...selectedEnquiry, status: status as any });
      toast.success(`Status updated to ${status}`);
    } catch (err) {
      toast.error('Status update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteEnquiry = async (id: string) => {
    setConfirmModal({ isOpen: true, id, isLoading: false });
  };

  const handleConfirmDelete = async () => {
    const { id } = confirmModal;
    setConfirmModal(prev => ({ ...prev, isLoading: true }));
    try {
      await enquiryService.delete(id);
      setEnquiries(prev => prev.filter(e => e.id !== id));
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      toast.info('Enquiry deleted');
    } catch (err) {
      toast.error('Deletion failed');
    } finally {
      setConfirmModal({ isOpen: false, id: '', isLoading: false });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'read': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-[#a55a3d]/70 font-light italic">Aligning data frequencies...</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-bold tracking-tight text-[#4a3b32]">Guest Enquiries</h1>
          <p className="mt-2 text-[#a55a3d]/70">Respond to the whispers of seekers.</p>
        </motion.div>
        <span className="rounded-full bg-[#bc6746]/5 border border-[#f1e4da] px-4 py-1 text-xs text-[#a55a3d]/50 font-bold">
          {enquiries.length} total requests
        </span>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {enquiries.map((enquiry, i) => (
            <GlassCard key={enquiry.id} delay={i * 0.05} className="group relative">
              <div className="flex flex-col h-full space-y-4">
                {/* Top Info */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-[#4a3b32] group-hover:text-[#bc6746] transition-colors uppercase tracking-wide">
                      {enquiry.name}
                    </h3>
                    <p className="text-xs text-[#a55a3d]/50 font-bold tracking-tighter uppercase">{enquiry.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <div className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase transition-all duration-300 ${getStatusColor(enquiry.status)}`}>
                      {enquiry.status}
                    </div>
                    {enquiry.interest && (
                      <span className="text-[9px] font-bold text-[#bc6746]/60 border border-[#bc6746]/20 bg-[#bc6746]/5 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        {enquiry.interest}
                      </span>
                    )}
                  </div>
                </div>

                {/* Message Preview */}
                <div className="flex-1">
                  <p className="text-sm text-[#a55a3d]/70 line-clamp-3 italic leading-relaxed">
                    "{enquiry.message}"
                  </p>
                </div>

                {/* Date & Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-[#f1e4da]">
                  <span className="text-[10px] text-[#a55a3d]/30 font-bold flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(enquiry.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setSelectedEnquiry(enquiry)}
                      className="p-2 rounded-lg bg-[#bc6746]/5 text-[#a55a3d]/30 hover:text-[#bc6746] hover:bg-[#bc6746]/10 transition-all active:scale-95"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => updateStatus(enquiry.id, enquiry.status === 'resolved' ? 'pending' : 'resolved')}
                      className="p-2 rounded-lg bg-[#bc6746]/5 text-[#a55a3d]/30 hover:text-green-600 hover:bg-green-600/10 transition-all active:scale-95"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteEnquiry(enquiry.id)}
                      className="p-2 rounded-lg bg-[#bc6746]/5 text-[#a55a3d]/30 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-95"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal - Enquiry Details */}
      <AnimatePresence>
        {selectedEnquiry && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#fffdf8] border border-[#f1e4da] rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Header Gradient */}
              <div className="h-2 bg-[#bc6746] w-full" />
              
              <div className="p-8 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-4 w-full">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-2xl bg-[#bc6746]/10 flex items-center justify-center text-[#bc6746]">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-[#4a3b32] uppercase tracking-wider">{selectedEnquiry.name}</h2>
                        <div className={`mt-1 px-3 py-1 rounded-full border inline-block text-[10px] font-bold uppercase ${getStatusColor(selectedEnquiry.status)}`}>
                          {selectedEnquiry.status}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-3 rounded-xl bg-white border border-[#f1e4da] shadow-sm">
                        <Mail className="h-4 w-4 text-[#bc6746]" />
                        <span className="text-sm text-[#4a3b32]/80 font-bold tracking-tight">{selectedEnquiry.email}</span>
                      </div>
                      {selectedEnquiry.phone && (
                        <div className="flex items-center space-x-3 p-3 rounded-xl bg-white border border-[#f1e4da] shadow-sm">
                          <Phone className="h-4 w-4 text-[#bc6746]" />
                          <span className="text-sm text-[#4a3b32]/80 font-bold">{selectedEnquiry.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedEnquiry(null)}
                    className="p-2 rounded-xl bg-[#bc6746]/5 text-[#a55a3d]/50 hover:text-[#4a3b32] hover:bg-[#bc6746]/10 transition-all active:scale-90"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-[#a55a3d]/50 uppercase tracking-widest flex items-center">
                    <MessageSquare className="w-3 h-3 mr-2" />
                    Seeker's Message
                  </span>
                  <div className="bg-[#bc6746]/5 p-6 rounded-2xl border border-[#bc6746]/10 relative">
                    <p className="text-[#4a3b32]/90 leading-relaxed italic text-lg">
                      "{selectedEnquiry.message}"
                    </p>
                    {selectedEnquiry.interest && (
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#bc6746]/40 uppercase tracking-widest">Interest:</span>
                        <span className="text-xs font-bold text-[#bc6746] bg-white px-3 py-1 rounded-full border border-[#bc6746]/10 shadow-sm uppercase tracking-wider">
                          {selectedEnquiry.interest}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                 <div className="flex items-center justify-between pt-4 border-t border-[#f1e4da]">
                  <div className="flex space-x-3">
                    {selectedEnquiry.status !== 'resolved' && (
                      <button 
                        onClick={() => updateStatus(selectedEnquiry.id, 'resolved')}
                        disabled={isUpdating}
                        className="flex items-center px-6 py-2 rounded-xl bg-green-50 text-green-700 border border-green-100 text-xs font-bold hover:bg-green-100 transition-all uppercase tracking-widest disabled:opacity-50"
                      >
                        {isUpdating ? <Loader2 className="h-3 w-3 mr-2 animate-spin" /> : null}
                        Resolve Request
                      </button>
                    )}
                    {selectedEnquiry.status === 'pending' && (
                      <button 
                        onClick={() => updateStatus(selectedEnquiry.id, 'read')}
                        disabled={isUpdating}
                        className="flex items-center px-6 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold hover:bg-blue-100 transition-all uppercase tracking-widest disabled:opacity-50"
                      >
                        {isUpdating ? <Loader2 className="h-3 w-3 mr-2 animate-spin" /> : null}
                        Mark as Read
                      </button>
                    )}
                  </div>
                  <button 
                    onClick={() => deleteEnquiry(selectedEnquiry.id)}
                    className="p-2 text-red-300 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        title="Delete Enquiry"
        message="Are you sure you want to permanently delete this enquiry? This action cannot be reversed."
        confirmText="Delete"
        variant="danger"
        isLoading={confirmModal.isLoading}
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmModal({ isOpen: false, id: '', isLoading: false })}
      />
    </div>
  );
}
