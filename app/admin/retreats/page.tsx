'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/admin/GlassCard';
import { retreatService, mediaService } from '@/lib/api/client';
import { 
  Palmtree, 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle,
  Calendar,
  DollarSign,
  Type,
  ImageIcon,
  X,
  Loader2,
  Layers,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

interface Retreat {
  id: string;
  title: string;
  description: string;
  price: number;
  image_urls: string[];
  date: string;
  created_at: string;
}

export default function RetreatsPage() {
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRetreat, setEditingRetreat] = useState<Retreat | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    date: '',
    image_urls: [] as string[],
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRetreats();
  }, []);

  const fetchRetreats = async () => {
    try {
      const response = await retreatService.list();
      setRetreats(response.data.data);
    } catch (err) {
      toast.error('Failed to load retreats');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (retreat: Retreat | null = null) => {
    if (retreat) {
      setEditingRetreat(retreat);
      setFormData({
        title: retreat.title,
        description: retreat.description,
        price: retreat.price.toString(),
        date: retreat.date ? new Date(retreat.date).toISOString().split('T')[0] : '',
        image_urls: retreat.image_urls || [],
      });
    } else {
      setEditingRetreat(null);
      setFormData({ title: '', description: '', price: '', date: '', image_urls: [] });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) {
      toast.warn('Please wait for uploads to complete');
      return;
    }
    setIsSubmitting(true);
    
    // Send clean JSON payload
    const payload = {
      title: formData.title,
      description: formData.description,
      price: formData.price,
      date: formData.date,
      existing_images: formData.image_urls
    };

    try {
      if (editingRetreat) {
        await retreatService.update(editingRetreat.id, payload);
        toast.success('Retreat sanctuary updated');
      } else {
        await retreatService.create(payload);
        toast.success('New sanctuary Manifested');
      }
      fetchRetreats();
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Manifestation failed in the void');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteRetreat = async (id: string) => {
    if (!window.confirm('Dissolve this sanctuary?')) return;
    try {
      await retreatService.delete(id);
      setRetreats(prev => prev.filter(r => r.id !== id));
      toast.info('Sanctuary dissolved');
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  const removeImage = async (url: string) => {
    try {
      // Optimistic update
      setFormData(prev => ({ 
        ...prev, 
        image_urls: prev.image_urls.filter(u => u !== url) 
      }));
      
      // Immediate purge from Bunny
      await mediaService.purge(url);
    } catch (err) {
      console.error('Failed to purge image:', err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadPromises = Array.from(files).map(file => mediaService.upload(file, 'retreats'));

    try {
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map(res => res.data.url);
      setFormData(prev => ({
        ...prev,
        image_urls: [...prev.image_urls, ...newUrls]
      }));
      toast.success(`${newUrls.length} images manifested`);
    } catch (err) {
      toast.error('Failed to upload some images');
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Opening portal to retreats...</div>;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-bold tracking-tight text-white">Retreat Sanctuaries</h1>
          <p className="mt-2 text-slate-400">Manage the portals to deep restoration.</p>
        </motion.div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          <span>New Retreat</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {retreats.map((retreat, i) => (
            <GlassCard key={retreat.id} noPadding delay={i * 0.05} className="group h-full flex flex-col">
              {/* Gallery Preview */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                {retreat.image_urls?.[0] ? (
                  <img 
                    src={retreat.image_urls[0]} 
                    alt={retreat.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-700">
                    <Palmtree className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                
                {/* Badge Overlay */}
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <span className="rounded-lg bg-black/40 px-3 py-1 text-xs font-bold text-white backdrop-blur-md border border-white/10 uppercase tracking-widest">
                    ${retreat.price}
                  </span>
                  <span className="rounded-lg bg-indigo-500/80 px-3 py-1 text-xs font-bold text-white backdrop-blur-md border border-white/10 flex items-center">
                    <Calendar className="h-3 h-3 mr-1" />
                    {retreat.date ? new Date(retreat.date).toLocaleDateString() : 'TBA'}
                  </span>
                </div>

                {/* Actions Overlay */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button onClick={() => handleOpenModal(retreat)} className="rounded-lg bg-white/10 p-2 text-white transition-all hover:bg-purple-500/50 hover:scale-110">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => deleteRetreat(retreat.id)} className="rounded-lg bg-white/10 p-2 text-white transition-all hover:bg-red-500/50 hover:scale-110">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider line-clamp-1">{retreat.title}</h3>
                  <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                </div>
                <p className="flex-1 text-xs text-slate-400 line-clamp-4 leading-relaxed italic">{retreat.description}</p>
                
                {/* Image Count indicators */}
                <div className="flex items-center space-x-1 pt-2">
                   <Layers className="h-3 w-3 text-slate-600 mr-1" />
                   <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{retreat.image_urls?.length || 0} Layers of imagery</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-slate-950 border border-white/10 shadow-2xl glass-modal shadow-indigo-500/20 flex flex-col"
            >
              <div className="h-2 bg-gradient-to-r from-emerald-500 to-indigo-600 w-full" />
              
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white uppercase tracking-widest">
                      {editingRetreat ? 'Update Sanctuary' : 'Manifest New Retreat'}
                    </h2>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                          <Type className="h-3 w-3 mr-2" /> Sanctuary Title
                        </label>
                        <input 
                          value={formData.title}
                          onChange={e => setFormData({...formData, title: e.target.value})}
                          className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white focus:border-emerald-500/50 outline-none transition-all"
                          placeholder="Sacred Silence Retreat..."
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                            <DollarSign className="h-3 w-3 mr-2" /> Energy Exchange
                          </label>
                          <input 
                            type="number"
                            value={formData.price}
                            onChange={e => setFormData({...formData, price: e.target.value})}
                            className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white focus:border-emerald-500/50 outline-none"
                            placeholder="1200"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                            <Calendar className="h-3 w-3 mr-2" /> Oracle Date
                          </label>
                          <input 
                            type="date"
                            value={formData.date}
                            onChange={e => setFormData({...formData, date: e.target.value})}
                            className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white focus:border-emerald-500/50 outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                          Sanctuary Description
                        </label>
                        <textarea 
                          value={formData.description}
                          onChange={e => setFormData({...formData, description: e.target.value})}
                          className="w-full h-48 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white focus:border-emerald-500/50 outline-none resize-none leading-relaxed"
                          placeholder="What journey awaits seekers in this portal?"
                        />
                      </div>
                    </div>

                    {/* Image Management */}
                    <div className="space-y-6">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                        <ImageIcon className="h-3 w-3 mr-2" /> Visual Layers (Gallery)
                      </label>
                      
                      {/* Current Images */}
                      <div className="grid grid-cols-3 gap-2">
                        {formData.image_urls.map((url, idx) => (
                          <div key={idx} className="group relative aspect-square rounded-lg overflow-hidden border border-white/5 bg-slate-900">
                            <img src={url} className="h-full w-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => removeImage(url)}
                              className="absolute top-1 right-1 p-1 rounded-md bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {/* Uploading Placeholders */}
                        {isUploading && (
                          <div className="relative aspect-square rounded-lg border border-indigo-500/30 bg-indigo-500/5 flex items-center justify-center">
                            <Loader2 className="h-6 w-6 text-indigo-400 animate-spin" />
                          </div>
                        )}
                        
                        <div className="relative aspect-square rounded-lg border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center text-slate-600 hover:border-emerald-500/30 hover:bg-white/10 transition-all cursor-pointer">
                           <Plus className="h-6 w-6 mb-1" />
                           <span className="text-[8px] font-bold uppercase tracking-widest">
                            {isUploading ? 'Uploading...' : 'Add Image'}
                           </span>
                           <input 
                            type="file" 
                            multiple 
                            accept="image/*"
                            disabled={isUploading}
                            onChange={handleImageUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                           />
                        </div>
                      </div>

                      <div className="rounded-2xl bg-indigo-500/5 border border-indigo-500/10 p-6 space-y-3">
                         <div className="flex items-center text-indigo-400">
                           <Layers className="w-4 h-4 mr-2" />
                           <span className="text-xs font-bold">Optimization Tip</span>
                         </div>
                         <p className="text-[10px] text-slate-500 leading-relaxed italic">
                           Each image is seamlessly manifested via the high-fidelity cloud storage. Recommend using landscape-oriented shots to maintain the sanctuary's aesthetic balance.
                         </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 space-x-4">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="px-8 py-3 rounded-xl border border-white/10 text-white font-bold transition-all hover:bg-white/5"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex items-center px-12 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-bold shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.03] active:scale-95 disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <CheckCircle className="h-5 w-5 mr-2" />}
                      {editingRetreat ? 'Harmonize Sanctuary' : 'Manifest Sanctuary'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
