'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for combining Tailwind classes
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  noPadding?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  delay = 0, 
  noPadding = false,
  onClick
}) => {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn(
        "relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl",
        "shadow-lg shadow-purple-500/5 transition-all duration-300",
        "hover:border-white/20 hover:bg-white/[0.08] hover:shadow-purple-500/10",
        "group overflow-hidden",
        !noPadding && "p-6",
        className
      )}
    >
      {/* Decorative Glow */}
      <div className="absolute -left-full top-0 h-full w-full bg-gradient-to-r from-transparent via-purple-500/10 to-transparent transition-all duration-1000 group-hover:left-full" />
      
      {children}
    </motion.div>
  );
};
