'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/admin/GlassCard';
import { dashboardService, enquiryService } from '@/lib/api/client';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  ArrowUpRight, 
  Clock 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';

const MOCK_CHART_DATA = [
  { name: 'Mon', value: 40 },
  { name: 'Tue', value: 30 },
  { name: 'Wed', value: 60 },
  { name: 'Thu', value: 45 },
  { name: 'Fri', value: 90 },
  { name: 'Sat', value: 75 },
  { name: 'Sun', value: 110 },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, enquiriesRes] = await Promise.all([
          dashboardService.stats(),
          enquiryService.list()
        ]);
        setStats(statsRes.data.data);
        setRecentEnquiries(enquiriesRes.data.data.slice(0, 5));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-12 w-12 animate-pulse rounded-full bg-purple-500/20 shadow-2xl shadow-purple-500/10" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-end justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-white">Dashboard Overview</h1>
          <p className="mt-2 text-slate-400">Welcome back to the sanctuary command center.</p>
        </motion.div>
        
        <div className="flex items-center space-x-3 text-sm text-slate-500">
          <Clock className="h-4 w-4" />
          <span>Last sync: Just now</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <GlassCard delay={0.1}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Enquiries</p>
              <h3 className="mt-2 text-4xl font-bold text-white">{stats?.enquiries_count || 0}</h3>
              <p className="mt-2 text-xs text-green-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+12% from last week</span>
              </p>
            </div>
            <div className="rounded-xl bg-purple-500/10 p-3 text-purple-400 ring-1 ring-white/10">
              <MessageSquare className="h-6 w-6" />
            </div>
          </div>
        </GlassCard>

        <GlassCard delay={0.2}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Visitors</p>
              <h3 className="mt-2 text-4xl font-bold text-white">{stats?.visitors_count || 0}</h3>
              <p className="mt-2 text-xs text-indigo-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>Steady growth</span>
              </p>
            </div>
            <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400 ring-1 ring-white/10">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </GlassCard>

        <GlassCard delay={0.3} className="bg-gradient-to-br from-purple-600/10 to-indigo-600/10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-bold text-white uppercase tracking-widest">Premium Content</p>
              <p className="text-xs text-slate-400">Manage sound sessions & retreats</p>
            </div>
            <ArrowUpRight className="h-8 w-8 text-white/20" />
          </div>
          <div className="mt-6 flex space-x-2">
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500" 
              />
            </div>
            <span className="text-[10px] text-slate-500">65%</span>
          </div>
        </GlassCard>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Activity Chart */}
        <div className="lg:col-span-2">
          <GlassCard noPadding delay={0.4} className="h-full">
            <div className="p-6 pb-0">
              <h3 className="text-lg font-bold text-white">Activity Pulse</h3>
              <p className="text-xs text-slate-500 mt-1">Growth of interactions over the last 7 days</p>
            </div>
            <div className="h-80 w-full p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_CHART_DATA}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#4b5563" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      borderRadius: '12px', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      color: '#fff'
                    }} 
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Recent Enquiries */}
        <GlassCard delay={0.5} className="flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Recent Enquiries</h3>
            <span className="text-[10px] text-purple-400 hover:underline cursor-pointer">View All</span>
          </div>
          <div className="flex-1 space-y-4">
            {recentEnquiries.map((enquiry, i) => (
              <motion.div 
                key={enquiry.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="group relative rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.05]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{enquiry.name}</h4>
                    <p className="text-[10px] text-slate-500">{enquiry.email}</p>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${enquiry.status === 'pending' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'bg-green-400'}`} />
                </div>
                <p className="mt-2 line-clamp-1 text-xs text-slate-400">
                  {enquiry.message}
                </p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
