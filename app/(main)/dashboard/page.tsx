'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Monitor, Cpu, Sparkles, Video } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useUiStore } from '@/store/ui.store';
import { apiClient } from '@/lib/api-client';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useCurrentUser();
  const { language } = useUiStore();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      apiClient.fetch('/api/history').then((data) => {
        if (data && Array.isArray(data)) setHistory(data.slice(0, 5));
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  if (isLoading || !isAuthenticated) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 tracking-tight">Salom, {user?.name}!</h1>
        <p className="text-[color:var(--text-muted)] text-lg">Muammoni tanlang yoki qidiring.</p>
      </div>

      {/* Main Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/software" className="group">
          <div className="card-custom h-[180px] bg-[color:var(--bg-card)] hover:border-[color:var(--border-hover)] relative flex flex-col justify-center items-center text-center">
            <Monitor className="w-8 h-8 mb-3 text-[color:var(--accent)] group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-lg text-[color:var(--text-primary)]">Software (Dasturiy)</h3>
            <p className="text-sm text-[color:var(--text-muted)] mt-1">Windows, drayverlar v.b muammolar</p>
            <ArrowRight className="absolute bottom-4 right-4 w-5 h-5 text-[color:var(--text-muted)] group-hover:text-[color:var(--accent)] transition-colors" />
          </div>
        </Link>
        <Link href="/hardware" className="group">
          <div className="card-custom h-[180px] bg-[color:var(--bg-card)] hover:border-[color:var(--border-hover)] relative flex flex-col justify-center items-center text-center">
            <Cpu className="w-8 h-8 mb-3 text-[color:var(--accent)] group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-lg text-[color:var(--text-primary)]">Hardware (Qurilma)</h3>
            <p className="text-sm text-[color:var(--text-muted)] mt-1">Ekran, korpus, qismlar muammosi</p>
            <ArrowRight className="absolute bottom-4 right-4 w-5 h-5 text-[color:var(--text-muted)] group-hover:text-[color:var(--accent)] transition-colors" />
          </div>
        </Link>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-[color:var(--text-primary)]">Oxirgi ko'rganlarim</h3>
            <Link href="/history" className="text-sm text-[color:var(--accent)] hover:underline">Hammasi &rarr;</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {history.map((item) => (
              <Link 
                key={item._id} 
                href={item.problemId ? `/problem/${item.problemId.slug}` : '#'}
                className="flex-shrink-0 w-[240px] p-4 bg-[color:var(--bg-secondary)] border border-[color:var(--border)] hover:border-[color:var(--border-hover)] rounded-xl transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="badge-custom bg-[color:var(--bg-card)] text-[color:var(--text-secondary)] border border-[color:var(--border)]">
                    {item.problemId?.category || 'Noma\'lum'}
                  </span>
                </div>
                <h4 className="font-medium text-sm text-[color:var(--text-primary)] line-clamp-2">
                  {item.problemId?.name?.[language] || item.problemId?.name?.uz || 'O\'chirilgan muammo'}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <h3 className="font-semibold text-[color:var(--text-primary)] mb-4">Tezkor havolalar</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/advisor" className="p-4 bg-[color:var(--bg-secondary)] border border-[color:var(--border)] hover:bg-[color:var(--bg-card)] rounded-xl flex items-center gap-3 transition-colors group">
          <div className="w-8 h-8 rounded-full bg-[color:var(--bg-card)] flex items-center justify-center text-[color:var(--accent)] group-hover:scale-110 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-medium text-sm">Noutbuk tanlash</span>
        </Link>
        <Link href="/consultation" className="p-4 bg-[color:var(--bg-secondary)] border border-[color:var(--border)] hover:bg-[color:var(--bg-card)] rounded-xl flex items-center gap-3 transition-colors group">
          <div className="w-8 h-8 rounded-full bg-[color:var(--bg-card)] flex items-center justify-center text-[color:var(--accent)] group-hover:scale-110 transition-transform">
            <Video className="w-4 h-4" />
          </div>
          <span className="font-medium text-sm">Texnik bilan ishlash</span>
        </Link>
      </div>

    </div>
  );
}
