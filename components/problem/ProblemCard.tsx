import React from 'react';
import Link from 'next/link';
import { LucideIcon, Wrench, Monitor, Cpu } from 'lucide-react';
import { Card } from '@/components/ui/card';

const icons: Record<string, LucideIcon> = {
  Monitor,
  Cpu,
  Wrench,
  // Add more as needed
};

interface ProblemCardProps {
  problem: {
    _id: string;
    name: { uz: string; ru: string; en: string };
    category: string;
    subcategory: string;
    slug: string;
    icon?: string;
    viewCount: number;
  };
  language: 'uz' | 'ru' | 'en';
}

export function ProblemCard({ problem, language }: ProblemCardProps) {
  const Icon = problem.icon && icons[problem.icon] ? icons[problem.icon] : Wrench;

  return (
    <Card className="card-custom group hover:border-[color:var(--border-hover)] flex flex-col h-full cursor-pointer bg-[color:var(--bg-card)] border-[color:var(--border)]">
      <Link href={`/problem/${problem.slug}`} className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-lg bg-[color:var(--bg-secondary)] flex items-center justify-center text-[color:var(--accent)] group-hover:bg-[color:var(--accent)] group-hover:text-white transition-colors">
            <Icon className="w-5 h-5" />
          </div>
          <span className="badge-custom bg-[color:var(--bg-secondary)] text-[color:var(--text-secondary)]">
            {problem.subcategory}
          </span>
        </div>
        
        <h4 className="font-semibold text-[color:var(--text-primary)] mb-2 line-clamp-2">
          {problem.name[language] || problem.name.uz}
        </h4>
        
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-[color:var(--border)] group-hover:border-[color:var(--border-hover)]">
          <div className="flex items-center text-xs text-[color:var(--text-muted)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            {problem.viewCount}
          </div>
          <span className="text-xs font-medium text-[color:var(--accent)] group-hover:text-[color:var(--accent-hover)] transition-colors">
            Ko'rish &rarr;
          </span>
        </div>
      </Link>
    </Card>
  );
}
