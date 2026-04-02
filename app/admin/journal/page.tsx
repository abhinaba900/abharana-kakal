'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/admin/GlassCard';
import { blogService } from '@/lib/api/client';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle,
  Tag,
  Type,
  ImageIcon,
  X,
  Loader2,
  Layers,
  FileText,
  Search,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  category_id: string;
  image_url: string;
  created_at: string;
  journal_categories: { name: string };
}

interface Category {
  id: string;
  name: string;
}

export default function JournalPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'categories'>('posts');
  const [loading, setLoading] = useState(true);
  
  // Post Form State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [postFormData, setPostFormData] = useState({
    title: '',
    content: '',
    category_id: '',
    image_url: '',
  });
  const [postImageFile, setPostImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category Form State
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [postsRes, catsRes] = await Promise.all([
        blogService.posts.list(),
        blogService.categories.list()
      ]);
      setPosts(postsRes.data.data);
      setCategories(catsRes.data.data);
    } catch (err) {
      toast.error('Failed to load journal vibrations');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPostModal = (post: BlogPost | null = null) => {
    if (post) {
      setEditingPost(post);
      setPostFormData({
        title: post.title,
        content: post.content,
        category_id: post.category_id || '',
        image_url: post.image_url || '',
      });
    } else {
      setEditingPost(null);
      setPostFormData({ title: '', content: '', category_id: categories[0]?.id || '', image_url: '' });
    }
    setPostImageFile(null);
    setIsPostModalOpen(true);
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = new FormData();
    data.append('title', postFormData.title);
    data.append('content', postFormData.content);
    data.append('category_id', postFormData.category_id);
    if (postImageFile) data.append('image', postImageFile);
    if (postFormData.image_url) data.append('image_url', postFormData.image_url);

    try {
      if (editingPost) {
        await blogService.posts.update(editingPost.id, data);
        toast.success('Journal entry Harmonized');
      } else {
        await blogService.posts.create(data);
        toast.success('New resonance Written');
      }
      fetchData();
      setIsPostModalOpen(false);
    } catch (err) {
      toast.error('Writing failed in the void');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!window.confirm('Delete this journal entry?')) return;
    try {
      await blogService.posts.delete(id);
      setPosts(prev => prev.filter(p => p.id !== id));
      toast.info('Entry dissolved');
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) return;
    try {
      await blogService.categories.create(newCategoryName);
      setNewCategoryName('');
      toast.success('Category Manifested');
      fetchData();
    } catch (err) {
      toast.error('Category manifestation failed');
    }
  };

  if (loading) return <div className="p-8 text-center text-[#a55a3d]/70 font-light italic">Unfolding the sacred scrolls...</div>;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-bold tracking-tight text-[#4a3b32]">The Sacred Journal</h1>
          <p className="mt-2 text-[#a55a3d]/70">Share your wisdom and restorative insights.</p>
        </motion.div>
        
        <div className="flex rounded-2xl bg-[#bc6746]/5 p-1 border border-[#f1e4da] backdrop-blur-xl">
           <button 
             onClick={() => setActiveTab('posts')}
             className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'posts' ? 'bg-[#bc6746] text-white shadow-lg' : 'text-[#a55a3d]/50 hover:text-[#bc6746]'}`}
           >
             POSTS
           </button>
           <button 
             onClick={() => setActiveTab('categories')}
             className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'categories' ? 'bg-[#bc6746] text-white shadow-lg' : 'text-[#a55a3d]/50 hover:text-[#bc6746]'}`}
           >
             CATEGORIES
           </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'posts' ? (
          <motion.div 
            key="posts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Post Controls */}
            <div className="flex items-center space-x-4">
               <div className="relative flex-1">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                 <input className="w-full rounded-2xl border border-white/5 bg-white/5 py-3 pl-12 pr-4 text-sm text-white placeholder-slate-600 outline-none focus:border-purple-500/30" placeholder="Search the archives..." />
               </div>
               <button onClick={() => handleOpenPostModal()} className="flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95">
                  <Plus className="h-5 w-5" />
                  <span>New Entry</span>
               </button>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <GlassCard key={post.id} noPadding delay={i * 0.05} className="group flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    {post.image_url && <img src={post.image_url} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="rounded-lg bg-white/10 px-3 py-1 text-[10px] font-bold text-purple-400 backdrop-blur-md border border-white/10 uppercase tracking-widest leading-none">
                        {post.journal_categories?.name || 'Wisdom'}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 flex space-x-2">
                       <button onClick={() => handleOpenPostModal(post)} className="p-2 rounded-lg bg-black/40 text-white backdrop-blur-md hover:bg-purple-500/50 transition-all"><Edit2 className="w-3 h-3" /></button>
                       <button onClick={() => deletePost(post.id)} className="p-2 rounded-lg bg-black/40 text-white backdrop-blur-md hover:bg-red-500/50 transition-all"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col space-y-3">
                    <h3 className="text-lg font-bold text-[#4a3b32] uppercase tracking-wider line-clamp-2 leading-tight group-hover:text-[#bc6746] transition-colors">
                      {post.title}
                    </h3>
                    <p className="flex-1 text-[11px] text-[#a55a3d]/70 line-clamp-4 italic leading-relaxed">
                      {post.content.substring(0, 200)}...
                    </p>
                    <div className="pt-4 flex items-center justify-between border-t border-[#f1e4da]">
                       <span className="text-[10px] text-[#a55a3d]/40 font-mono tracking-tighter">
                         {new Date(post.created_at).toLocaleDateString()}
                       </span>
                       <FileText className="w-3 h-3 text-[#a55a3d]/10" />
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="categories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto"
          >
            <GlassCard>
               <h3 className="text-xl font-bold text-[#4a3b32] mb-6 uppercase tracking-widest">Category Manifestation</h3>
               <form onSubmit={addCategory} className="flex space-x-4 mb-8">
                  <input 
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    className="flex-1 rounded-2xl border border-[#f1e4da] bg-white p-4 text-sm text-[#4a3b32] focus:border-[#bc6746] outline-none shadow-sm"
                    placeholder="E.g., Quantum Healing, Nature, Wellness..."
                  />
                  <button type="submit" className="px-8 py-4 rounded-2xl bg-[#bc6746] text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#bc6746]/10">
                    MANIFEST
                  </button>
               </form>

               <div className="space-y-3">
                  <label className="text-[10px] font-bold text-[#a55a3d]/50 uppercase tracking-[0.2em] mb-2 block">Current Foundations</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                     {categories.map(cat => (
                       <div key={cat.id} className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#f1e4da] group hover:border-[#bc6746]/30 transition-all shadow-sm">
                          <div className="flex items-center space-x-3">
                            <Tag className="w-4 h-4 text-[#bc6746]" />
                            <span className="text-sm text-[#4a3b32]/80 font-bold uppercase tracking-wider">{cat.name}</span>
                          </div>
                          <button className="text-[#a55a3d]/30 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><X className="w-4 h-4" /></button>
                       </div>
                     ))}
                  </div>
               </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Modal */}
      <AnimatePresence>
        {isPostModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="w-full max-w-5xl rounded-3xl overflow-hidden bg-[#fffdf8] border border-[#f1e4da] shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="h-2 bg-[#bc6746] w-full" />
              <form onSubmit={handlePostSubmit} className="p-8 flex-1 overflow-y-auto custom-scrollbar space-y-8">
                 <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-[#4a3b32] uppercase tracking-widest">
                       {editingPost ? 'Edit Resonance' : 'Write Eternal Inspiration'}
                    </h2>
                    <button type="button" onClick={() => setIsPostModalOpen(false)} className="p-2 rounded-xl bg-[#bc6746]/5 text-[#a55a3d]/50 hover:text-[#bc6746] transition-all"><X className="w-6 h-6" /></button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-[#a55a3d]/50 uppercase tracking-widest">Post Title</label>
                          <input 
                             value={postFormData.title}
                             onChange={e => setPostFormData({...postFormData, title: e.target.value})}
                             className="w-full rounded-2xl border border-[#f1e4da] bg-white p-4 text-xl font-bold text-[#4a3b32] focus:border-[#bc6746] outline-none shadow-sm"
                             placeholder="The Awakening Journey..."
                             required
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-[#a55a3d]/50 uppercase tracking-widest">Cosmic Wisdom (Content)</label>
                          <textarea 
                             value={postFormData.content}
                             onChange={e => setPostFormData({...postFormData, content: e.target.value})}
                             className="w-full h-[320px] rounded-2xl border border-[#f1e4da] bg-white p-6 text-sm text-[#4a3b32]/80 focus:border-[#bc6746] outline-none resize-none leading-relaxed italic shadow-sm"
                             placeholder="Flow your thoughts into existence..."
                             required
                          />
                       </div>
                    </div>

                    {/* Meta Sidebar */}
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-[#a55a3d]/50 uppercase tracking-widest italic">Foundation (Category)</label>
                          <select 
                            value={postFormData.category_id}
                            onChange={e => setPostFormData({...postFormData, category_id: e.target.value})}
                            className="w-full rounded-2xl border border-[#f1e4da] bg-white p-4 text-sm text-[#4a3b32] focus:border-[#bc6746] outline-none appearance-none shadow-sm"
                          >
                             {categories.map(cat => <option key={cat.id} value={cat.id} className="bg-white">{cat.name}</option>)}
                          </select>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-[#a55a3d]/50 uppercase tracking-widest">Energy Snapshot (Thumbnail)</label>
                          <div className="relative h-64 w-full rounded-3xl overflow-hidden border-2 border-dashed border-[#f1e4da] bg-white transition-all hover:border-[#bc6746]/30 flex items-center justify-center group cursor-pointer shadow-sm">
                             {(postImageFile || postFormData.image_url) ? (
                               <img 
                                 src={postImageFile ? URL.createObjectURL(postImageFile) : postFormData.image_url} 
                                 className="h-full w-full object-cover" 
                               />
                             ) : (
                               <div className="text-center space-y-2 text-[#a55a3d]/30">
                                 <Plus className="h-10 w-10 mx-auto" />
                                 <p className="text-[10px] font-bold uppercase tracking-widest">Invoke Image</p>
                               </div>
                             )}
                             <input 
                               type="file" 
                               accept="image/*"
                               onChange={e => setPostImageFile(e.target.files?.[0] || null)}
                               className="absolute inset-0 opacity-0 cursor-pointer"
                             />
                          </div>
                          <p className="text-[10px] text-[#a55a3d]/30 italic mt-2 text-center">Optimized for high-vibrational displays.</p>
                       </div>
                    </div>
                 </div>

                 <div className="flex justify-end pt-4 space-x-4">
                    <button 
                      type="button" 
                      onClick={() => setIsPostModalOpen(false)}
                      className="px-8 py-3 rounded-2xl text-[#a55a3d]/50 hover:text-[#4a3b32] transition-all font-bold uppercase tracking-widest text-xs"
                    >
                      Wait (Cancel)
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="px-12 py-4 rounded-2xl bg-[#bc6746] text-white font-bold shadow-xl shadow-[#bc6746]/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center"
                    >
                      {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <BookOpen className="h-5 w-5 mr-2" />}
                      {editingPost ? 'RESTORE HARMONY' : 'MANIFEST WISDOM'}
                    </button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
