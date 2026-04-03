'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/admin/GlassCard';
import { soundService, mediaService } from '@/lib/api/client';
import { 
  Music, 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle,
  Play,
  Volume2,
  DollarSign,
  Type,
  FileAudio,
  Image as ImageIcon,
  X,
  Loader2,
  CloudLightning,
  Pause
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { AdminAudioPlayer } from '@/components/admin/AdminAudioPlayer';
import { ConfirmModal } from '@/components/admin/modals/ConfirmModal';

interface SoundSession {
  id: string;
  title: string;
  description: string;
  audio_url: string;
  image_url: string;
  metadata?: any;
  intent?: string;
  frequency?: string;
  duration?: string;
  color?: string;
  created_at: string;
}

interface UpcomingSession {
  id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
}

export default function SoundHealingPage() {
  const [activeTab, setActiveTab] = useState<'library' | 'upcoming'>('library');
  const [sessions, setSessions] = useState<SoundSession[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    audio_url: '',
    image_url: '',
    metadata: '',
    intent: '',
    frequency: '',
    duration: '',
    color: '#bc6746',
  });
  
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    id: string;
    isLoading: boolean;
  }>({ isOpen: false, id: '', isLoading: false });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [libRes, upcomingRes] = await Promise.all([
        soundService.list(),
        soundService.upcoming.list()
      ]);
      setSessions(libRes.data.data);
      setUpcomingSessions(upcomingRes.data.data);
    } catch (err) {
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (session: any = null) => {
    if (session) {
      setEditingSession(session);
      setFormData({
        title: session.title || '',
        description: session.description || '',
        audio_url: session.audio_url || '',
        image_url: session.image_url || '',
        metadata: session.metadata ? JSON.stringify(session.metadata, null, 2) : '',
        intent: session.intent || '',
        frequency: session.frequency || '',
        duration: session.duration || '',
        color: session.color || '#bc6746',
      });
    } else {
      setEditingSession(null);
      setFormData({ 
        title: '', 
        description: '', 
        audio_url: '', 
        image_url: '',
        metadata: '',
        intent: '',
        frequency: '',
        duration: '',
        color: '#bc6746',
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploadingImage(true);
    const toastId = toast.loading('Uploading spiritual vision...');
    
    try {
      const res = await mediaService.upload(file, 'images');
      if (res.data.success) {
        setFormData(prev => ({ ...prev, image_url: res.data.url }));
        toast.update(toastId, { render: 'Vision captured in storage!', type: 'success', isLoading: false, autoClose: 3000 });
      }
    } catch (err) {
      toast.update(toastId, { render: 'Failed to upload image', type: 'error', isLoading: false, autoClose: 3000 });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploadingAudio(true);
    const toastId = toast.loading('Uploading frequency masterpiece...');
    
    try {
      const res = await mediaService.upload(file, 'audio');
      if (res.data.success) {
        setFormData(prev => ({ ...prev, audio_url: res.data.url }));
        toast.update(toastId, { render: 'Frequency resonated with storage!', type: 'success', isLoading: false, autoClose: 3000 });
      }
    } catch (err) {
      toast.update(toastId, { render: 'Failed to upload audio', type: 'error', isLoading: false, autoClose: 3000 });
    } finally {
      setIsUploadingAudio(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploadingAudio || isUploadingImage) {
      toast.warning('Please wait for uploads to complete');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (activeTab === 'library') {
        const payload = {
          title: formData.title,
          description: formData.description,
          audio_url: formData.audio_url,
          image_url: formData.image_url,
          metadata: formData.metadata ? JSON.parse(formData.metadata) : null,
          intent: formData.intent,
          frequency: formData.frequency,
          duration: formData.duration,
          color: formData.color,
        };

        if (editingSession) {
          await soundService.update(editingSession.id, payload);
          toast.success('Library session updated');
        } else {
          await soundService.create(payload);
          toast.success('Library session created');
        }
      } else {
        // Upcoming Spotlight Payload
        const payload = {
          title: formData.title,
          description: formData.description,
          image_url: formData.image_url,
        };

        if (editingSession) {
          await soundService.upcoming.update(editingSession.id, payload);
          toast.success('Upcoming session updated');
        } else {
          await soundService.upcoming.create(payload);
          toast.success('Upcoming session created');
        }
      }
      fetchAll();
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Operation failed. Check JSON or connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteSession = async (id: string) => {
    setConfirmModal({ isOpen: true, id, isLoading: false });
  };

  const handleConfirmDelete = async () => {
    const { id } = confirmModal;
    setConfirmModal(prev => ({ ...prev, isLoading: true }));
    try {
      if (activeTab === 'library') {
        await soundService.delete(id);
      } else {
        await soundService.upcoming.delete(id);
      }
      fetchAll();
      toast.info('Session removed');
    } catch (err) {
      toast.error('Deletion failed');
    } finally {
      setConfirmModal({ isOpen: false, id: '', isLoading: false });
    }
  };

  if (loading) return <div className="p-8 text-center text-[#a55a3d]/50">Tuning frequencies...</div>;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-bold tracking-tight text-[#4a3b32]">Sound Healing</h1>
          <p className="mt-2 text-[#a55a3d]/70">Curate the frequencies of transformation.</p>
        </motion.div>
        
        <div className="flex items-center space-x-4">
          {/* Tab Switcher */}
          <div className="flex p-1 rounded-2xl bg-white/40 border border-[#f1e4da] backdrop-blur-md">
            <button
              onClick={() => setActiveTab('library')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'library' ? 'bg-[#bc6746] text-white shadow-lg' : 'text-[#a55a3d]/50 hover:text-[#bc6746]'}`}
            >
              Sound Library
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'upcoming' ? 'bg-[#bc6746] text-white shadow-lg' : 'text-[#a55a3d]/50 hover:text-[#bc6746]'}`}
            >
              Upcoming Sessions
            </button>
          </div>

          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 rounded-2xl bg-[#bc6746] px-6 py-3 font-bold text-white shadow-lg shadow-[#bc6746]/10 transition-all hover:bg-[#a55a3d] hover:scale-105 active:scale-95"
          >
            <Plus className="h-5 w-5" />
            <span>New {activeTab === 'library' ? 'Library' : 'Session'}</span>
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {activeTab === 'library' ? (
            // Library View
            sessions.map((session, i) => (
              <GlassCard key={session.id} noPadding delay={i * 0.05} className="group h-full flex flex-col">
                <div className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={session.image_url || 'https://via.placeholder.com/400x200?text=No+Image'} 
                    alt={session.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-end">
                    <div className="flex space-x-2">
                      <button onClick={() => handleOpenModal(session)} className="rounded-lg bg-white/20 p-2 text-white transition-colors hover:bg-[#bc6746]">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteSession(session.id)} className="rounded-lg bg-white/20 p-2 text-white transition-colors hover:bg-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-bold text-[#4a3b32] uppercase tracking-wider line-clamp-1">{session.title}</h3>
                    <div className="h-8 w-8 rounded-full bg-[#bc6746]/10 flex items-center justify-center text-[#bc6746]">
                      <Music className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="flex-1 text-xs text-[#a55a3d]/70 line-clamp-3 leading-relaxed italic">{session.description}</p>
                  
                  {session.audio_url && (
                    <div className="w-full">
                      <AdminAudioPlayer src={session.audio_url} />
                    </div>
                  )}
                </div>
              </GlassCard>
            ))
          ) : (
            upcomingSessions.map((session, i) => {
              return (
                <GlassCard key={session.id} noPadding delay={i * 0.05} className="group h-full flex flex-col overflow-hidden">
                  <div className="relative h-56 w-full">
                    <img 
                      src={session.image_url || 'https://via.placeholder.com/400x200?text=No+Image'} 
                      alt={session.title}
                      className="h-full w-full object-cover grayscale-[20%] transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
                    
                    {/* Meta Tags */}
                    <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                    </div>

                    <div className="absolute bottom-4 right-4 flex space-x-2">
                      <button onClick={() => handleOpenModal(session)} className="rounded-xl bg-white/20 p-2 text-white transition-all hover:bg-[#bc6746] backdrop-blur-md">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteSession(session.id)} className="rounded-xl bg-white/20 p-2 text-white transition-all hover:bg-red-500 backdrop-blur-md">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs font-black tracking-widest text-[#bc6746] uppercase">
                      <span className="opacity-60">Synchronized Gathering</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-[#4a3b32] transition-colors group-hover:text-[#bc6746]">
                      {session.title}
                    </h3>
                    
                    <p className="text-xs text-[#a55a3d]/70 line-clamp-2 leading-relaxed italic">
                      "{session.description}"
                    </p>
                    
                    <div className="pt-4 mt-auto">
                      <div className="flex items-center justify-between border-t border-[#f1e4da] pt-4">
                        <span className="text-lg font-bold text-[#4a3b32] tracking-widest uppercase text-[10px] opacity-40">Guided Session</span>
                        <div className="h-8 w-8 rounded-full border border-[#f1e4da] flex items-center justify-center text-[#a55a3d]/50 group-hover:border-[#bc6746] group-hover:text-[#bc6746] transition-all">
                          <Plus className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white border border-[#f1e4da] shadow-2xl shadow-[#bc6746]/10"
            >
              <div className="h-2 bg-[#bc6746] w-full" />
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#4a3b32] uppercase tracking-widest">
                    {editingSession ? 'Edit Vibration' : 'Create New Frequency'}
                  </h2>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="text-[#a55a3d]/50 hover:text-[#bc6746] transition-colors">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Col */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#a55a3d]/50 uppercase tracking-widest flex items-center">
                        <Type className="h-3 w-3 mr-2" /> Title
                      </label>
                      <input 
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className="w-full rounded-xl border border-[#f1e4da] bg-[#fcf9f2]/50 p-3 text-sm text-[#4a3b32] focus:border-[#bc6746]/50 outline-none"
                        placeholder="Celestial Resonance..."
                        required
                      />
                    </div>

                    {activeTab === 'upcoming' && (
                      <>
                        <div className="p-2 text-[10px] text-[#a55a3d]/40 italic">
                           Upcoming gatherings are currently spotlighted by title and imagery only.
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#a55a3d]/50 uppercase tracking-widest flex items-center">
                        Description
                      </label>
                      <textarea 
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full h-32 rounded-xl border border-[#f1e4da] bg-[#fcf9f2]/50 p-3 text-sm text-[#4a3b32] focus:border-[#bc6746]/50 outline-none resize-none"
                        placeholder="Describe the journey..."
                      />
                    </div>

                    {activeTab === 'library' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#bc6746] uppercase tracking-widest">Intent</label>
                          <input 
                            value={formData.intent}
                            onChange={e => setFormData({...formData, intent: e.target.value})}
                            className="w-full rounded-xl border border-[#f1e4da] bg-[#fcf9f2]/50 p-3 text-sm text-[#4a3b32] focus:border-[#bc6746]/50 outline-none"
                            placeholder="Deep Rest"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#bc6746] uppercase tracking-widest">Frequency</label>
                          <input 
                            value={formData.frequency}
                            onChange={e => setFormData({...formData, frequency: e.target.value})}
                            className="w-full rounded-xl border border-[#f1e4da] bg-[#fcf9f2]/50 p-3 text-sm text-[#4a3b32] focus:border-[#bc6746]/50 outline-none"
                            placeholder="528Hz"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#bc6746] uppercase tracking-widest">Duration</label>
                          <input 
                            value={formData.duration}
                            onChange={e => setFormData({...formData, duration: e.target.value})}
                            className="w-full rounded-xl border border-[#f1e4da] bg-[#fcf9f2]/50 p-3 text-sm text-[#4a3b32] focus:border-[#bc6746]/50 outline-none"
                            placeholder="20:00"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#bc6746] uppercase tracking-widest">UI Color</label>
                          <input 
                            type="color"
                            value={formData.color}
                            onChange={e => setFormData({...formData, color: e.target.value})}
                            className="w-full h-11 rounded-xl border border-[#f1e4da] bg-[#fcf9f2]/50 p-1 outline-none cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Col - Media */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#a55a3d]/50 uppercase tracking-widest flex items-center">
                        <ImageIcon className="h-3 w-3 mr-2" /> Thumbnail Image
                      </label>
                      <div className="group relative h-40 w-full rounded-2xl border-2 border-dashed border-[#f1e4da] bg-[#fcf9f2]/50 transition-all hover:border-[#bc6746]/30 overflow-hidden">
                        {formData.image_url ? (
                          <div className="relative h-full w-full">
                            <img 
                              src={formData.image_url} 
                              className="h-full w-full object-cover" 
                            />
                            {isUploadingImage && (
                              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
                                <Loader2 className="h-8 w-8 text-[#bc6746] animate-spin mb-2" />
                                <span className="text-[10px] text-[#bc6746] font-bold tracking-widest uppercase">Uploading Vision...</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center text-[#a55a3d]/30">
                            {isUploadingImage ? (
                               <>
                                <Loader2 className="h-8 w-8 mb-2 animate-spin text-[#bc6746]" />
                                <span className="text-[10px]">Processing...</span>
                               </>
                            ) : (
                              <>
                                <Plus className="h-8 w-8 mb-2" />
                                <span className="text-[10px]">Max 2MB .jpg/.png</span>
                              </>
                            )}
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploadingImage}
                          className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-wait"
                        />
                      </div>
                    </div>

                    {activeTab === 'library' && (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#a55a3d]/50 uppercase tracking-widest flex items-center">
                            <FileAudio className="h-3 w-3 mr-2" /> High-Fidelity Audio
                          </label>
                          <div className="relative rounded-xl border border-[#f1e4da] bg-[#fcf9f2]/50 p-4 transition-all hover:border-[#bc6746]/30">
                            <div className="flex items-center space-x-3">
                              {isUploadingAudio ? (
                                <Loader2 className="h-8 w-8 text-[#bc6746] animate-spin" />
                              ) : (
                                <Music className={`h-8 w-8 ${formData.audio_url ? 'text-[#bc6746]' : 'text-[#a55a3d]/30'}`} />
                              )}
                              <div className="flex-1 overflow-hidden">
                                <p className="text-[10px] text-[#a55a3d]/70 truncate">
                                  {isUploadingAudio ? 'Uploading masterpiece...' : (formData.audio_url ? 'Active Audio Bonded' : 'Click to upload masterpiece')}
                                </p>
                                {formData.audio_url && !isUploadingAudio && (
                                  <div className="mt-1 flex items-center text-[8px] text-green-600 font-bold uppercase tracking-widest">
                                    <CheckCircle className="h-2 w-2 mr-1" /> Ready in Storage
                                  </div>
                                )}
                              </div>
                            </div>
                            <input 
                              type="file" 
                              accept="audio/*"
                              onChange={handleAudioUpload}
                              disabled={isUploadingAudio}
                              className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-wait"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#a55a3d]/50 uppercase tracking-widest flex items-center">
                            Metadata (JSON Integration)
                          </label>
                          <textarea 
                            value={formData.metadata}
                            onChange={e => setFormData({...formData, metadata: e.target.value})}
                            className="w-full h-24 rounded-xl border border-[#f1e4da] bg-[#fcf9f2]/50 p-3 text-[10px] font-mono text-[#a55a3d]/70 focus:border-[#bc6746]/50 outline-none resize-none"
                            placeholder='{ "focus": "cellular-level" }'
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4 space-x-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-3 rounded-xl border border-[#f1e4da] text-[#4a3b32] font-bold transition-all hover:bg-[#fcf9f2]"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting || isUploadingAudio || isUploadingImage}
                    className="flex items-center px-12 py-3 rounded-xl bg-[#bc6746] text-white font-bold shadow-xl shadow-[#bc6746]/10 transition-all hover:bg-[#a55a3d] hover:scale-[1.03] active:scale-95 disabled:opacity-50 disabled:grayscale"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (isUploadingAudio || isUploadingImage) ? (
                      <CloudLightning className="h-5 w-5 animate-pulse mr-2" />
                    ) : (
                      <CheckCircle className="h-5 w-5 mr-2" />
                    )}
                    {isSubmitting ? 'Syncing...' : (isUploadingAudio || isUploadingImage) ? 'Uploading Media...' : (editingSession ? 'Update Resonance' : 'Invoke Session')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        title="Dissolve Frequency"
        message="Are you sure you want to permanently dissolve this vibration from the archives?"
        confirmText="Dissolve"
        variant="danger"
        isLoading={confirmModal.isLoading}
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmModal({ isOpen: false, id: '', isLoading: false })}
      />
    </div>
  );
}
