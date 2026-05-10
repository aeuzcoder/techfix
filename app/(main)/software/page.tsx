'use client';

import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ProblemCard } from '@/components/problem/ProblemCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { apiClient } from '@/lib/api-client';
import { useUiStore } from '@/store/ui.store';

export default function SoftwarePage() {
  const [problems, setProblems] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Barchasi');
  const { language } = useUiStore();

  useEffect(() => {
    Promise.all([
      apiClient.fetch('/api/problems?category=software'),
      apiClient.fetch('/api/problems/categories')
    ]).then(([probs, cats]) => {
      setProblems(probs || []);
      setCategories(['Barchasi', ...(cats?.software || [])]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = problems.filter((p) => {
    const matchesSearch = (p.name[language] || p.name.uz || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeFilter === 'Barchasi' || p.subcategory === activeFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Software muammolari</h1>
        <span className="badge-custom bg-[color:var(--bg-secondary)] text-[color:var(--text-muted)] border border-[color:var(--border)]">
          {problems.length} ta
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--text-muted)]" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-[36px] w-full bg-[color:var(--bg-secondary)]"
            placeholder="Qidirish..."
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors border ${
                activeFilter === cat 
                  ? 'bg-[color:var(--accent)] text-white border-[color:var(--accent)]' 
                  : 'bg-[color:var(--bg-secondary)] text-[color:var(--text-secondary)] border-[color:var(--border)] hover:border-[color:var(--border-hover)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-xl bg-[color:var(--bg-secondary)]" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((problem) => (
            <ProblemCard key={problem._id} problem={problem} language={language} />
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={Search} 
          title="Natija topilmadi" 
          description="Boshqa qidiruv so'zini yozib ko'ring yoki boshqa kategoriyani tanlang" 
        />
      )}
    </div>
  );
}
