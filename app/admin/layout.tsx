'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { CosmicBackground } from '@/components/admin/CosmicBackground';
import { Sidebar } from '@/components/admin/Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <AdminAuthProvider>
      <CosmicBackground>
        {!isLoginPage && <Sidebar />}
        
        <main className={!isLoginPage ? "flex-1 ml-64 p-8 transition-all duration-500" : "flex-1"}>
          {children}
        </main>
        
        <ToastContainer
          position="bottom-right"
          theme="dark"
          toastStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
        />
      </CosmicBackground>
    </AdminAuthProvider>
  );
}
