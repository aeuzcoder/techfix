'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search as SearchIcon, SearchX } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProblemCard } from '@/components/problem/ProblemCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { apiClient } from '@/lib/api-client';
import { useUiStore } from '@/store/ui.store';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useUiStore();

  useEffect(() => {
    if (!query) {
      setProblems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    apiClient.fetch(`/api/problems?search=${encodeURIComponent(query)}`)
      .then((data) => {
        setProblems(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold border-b border-[color:var(--border)] pb-4">
        &quot;{query}&quot; bo'yicha natijalar
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-xl bg-[color:var(--bg-secondary)]" />
          ))}
        </div>
      ) : problems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {problems.map((problem) => (
            <ProblemCard key={problem._id} problem={problem} language={language} />
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={SearchX} 
          title="Natija topilmadi" 
          description="Boshqa so'z bilan qidirib ko'ring yoki atamalarni to'g'rilang" 
        />
      )}
    </div>
  );
}
