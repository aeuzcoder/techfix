'use client';

import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();

  if (isLoading) {
    return <div className="min-h-screen bg-[color:var(--bg-primary)] flex items-center justify-center">Yuklanmoqda...</div>;
  }

  if (user?.role !== 'admin') {
    // Client side fallback redirect just in case
    router.replace('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-[color:var(--bg-primary)] text-[color:var(--text-primary)]">
      <AdminSidebar />
      <div className="pl-[220px] flex flex-col min-h-screen">
        <header className="h-14 fixed top-0 right-0 left-[220px] bg-[color:var(--bg-primary)]/80 backdrop-blur-md border-b border-[color:var(--border)] z-30 flex items-center justify-between px-6">
          <h3 className="text-[15px] font-semibold text-[color:var(--text-primary)]">
            Admin Panel
          </h3>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">
               A
             </div>
          </div>
        </header>
        <main className="flex-1 pt-20 pb-6 px-8 max-w-[1200px] w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
