'use client';

import React, { useEffect, useState, memo } from 'react';
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

// Memoized Chart component to isolate re-renders
const ActivityChart = memo(function ActivityChart({ data }: { data: any[] }) {
  return (
    <div className="h-80 w-full p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#bc6746" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#bc6746" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1e4da" />
          <XAxis 
            dataKey="name" 
            stroke="#a55a3d" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
          />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              borderRadius: '12px', 
              border: '1px solid #f1e4da',
              backdropFilter: 'blur(10px)',
              color: '#4a3b32'
            }} 
            itemStyle={{ color: '#bc6746' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#bc6746" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

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
        <div className="h-12 w-12 animate-pulse rounded-full bg-[#bc6746]/20 shadow-2xl shadow-[#bc6746]/10" />
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
          <h1 className="text-4xl font-bold tracking-tight text-[#4a3b32]">Dashboard Overview</h1>
          <p className="mt-2 text-[#a55a3d]/70">Welcome back to the sanctuary command center.</p>
        </motion.div>
        
        <div className="flex items-center space-x-3 text-sm text-[#a55a3d]/50">
          <Clock className="h-4 w-4" />
          <span>Last sync: Just now</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <GlassCard delay={0.1}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[#a55a3d]/70 uppercase tracking-widest">Enquiries</p>
              <h3 className="mt-2 text-4xl font-bold text-[#4a3b32]">{stats?.enquiries_count || 0}</h3>
              <p className="mt-2 text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+12% from last week</span>
              </p>
            </div>
            <div className="rounded-xl bg-[#bc6746]/10 p-3 text-[#bc6746] ring-1 ring-[#bc6746]/10">
              <MessageSquare className="h-6 w-6" />
            </div>
          </div>
        </GlassCard>

        <GlassCard delay={0.2}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[#a55a3d]/70 uppercase tracking-widest">Visitors</p>
              <h3 className="mt-2 text-4xl font-bold text-[#4a3b32]">{stats?.visitors_count || 0}</h3>
              <p className="mt-2 text-xs text-[#bc6746] flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>Steady growth</span>
              </p>
            </div>
            <div className="rounded-xl bg-[#bc6746]/10 p-3 text-[#bc6746] ring-1 ring-[#bc6746]/10">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </GlassCard>

        <GlassCard delay={0.3} className="bg-gradient-to-br from-[#bc6746]/5 to-[#a55a3d]/5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-bold text-[#4a3b32] uppercase tracking-widest">Premium Content</p>
              <p className="text-xs text-[#a55a3d]/70">Manage sound sessions & retreats</p>
            </div>
            <ArrowUpRight className="h-8 w-8 text-[#bc6746]/20" />
          </div>
          <div className="mt-6 flex space-x-2">
            <div className="h-1 w-full bg-[#f1e4da] rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-[#bc6746]" 
              />
            </div>
            <span className="text-[10px] text-[#a55a3d]/50">65%</span>
          </div>
        </GlassCard>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Activity Chart */}
        <div className="lg:col-span-2">
          <GlassCard noPadding delay={0.4} className="h-full">
            <div className="p-6 pb-0">
              <h3 className="text-lg font-bold text-[#4a3b32]">Activity Pulse</h3>
              <p className="text-xs text-[#a55a3d]/50 mt-1">Growth of interactions over the last 7 days</p>
            </div>
            <ActivityChart data={MOCK_CHART_DATA} />
          </GlassCard>
        </div>

        {/* Recent Enquiries */}
        <GlassCard delay={0.5} className="flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#4a3b32]">Recent Enquiries</h3>
            <span className="text-[10px] text-[#bc6746] hover:underline cursor-pointer">View All</span>
          </div>
          <div className="flex-1 space-y-4">
            {recentEnquiries.map((enquiry, i) => (
              <motion.div 
                key={enquiry.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="group relative rounded-xl border border-[#f1e4da] bg-white transition-all hover:bg-[#fcf9f2]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-[#4a3b32]">{enquiry.name}</h4>
                    <p className="text-[10px] text-[#a55a3d]/50">{enquiry.email}</p>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${enquiry.status === 'pending' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'bg-green-400'}`} />
                </div>
                <p className="mt-2 line-clamp-1 text-xs text-[#a55a3d]/70">
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

