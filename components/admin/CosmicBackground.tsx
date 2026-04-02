'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const CosmicBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 font-sans text-slate-200">
      {/* Animated Auras */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -40, 0],
          y: [0, 60, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-20 top-1/4 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[150px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-10%] left-1/4 h-[600px] w-[600px] rounded-full bg-blue-600/5 blur-[200px]"
      />

      {/* Content Layer */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {children}
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 z-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
    </div>
  );
};
