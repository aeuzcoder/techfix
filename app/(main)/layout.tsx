'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useAuthStore } from '@/store/auth.store';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show nothing while loading or if not authenticated (redirect in progress)
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="flex flex-col items-center gap-4">
          <span className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Tech<span style={{ color: 'var(--accent)' }}>Fix</span>
          </span>
          <div className="w-6 h-6 rounded-full border-2 border-[#7c6dfa] border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Sidebar />
      <div className="md:pl-[220px] flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-14 pb-20 md:pb-6 px-4 md:px-8 max-w-[1200px] mx-auto w-full mt-6">
          {children}
        </main>
      </div>
    </div>
  );
}
