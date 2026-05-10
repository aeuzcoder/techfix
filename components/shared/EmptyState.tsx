'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="h-16 w-16 bg-[color:var(--bg-card)] border border-[color:var(--border)] rounded-full flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-[color:var(--text-muted)]" />
      </div>
      <h3 className="text-lg font-semibold text-[color:var(--text-primary)] mb-2">{title}</h3>
      {description && <p className="text-[14px] text-[color:var(--text-muted)] max-w-sm mb-6">{description}</p>}
      
      {action && (
        <Link 
          href={action.href} 
          className="btn-custom bg-[color:var(--bg-card)] hover:bg-[color:var(--bg-secondary)] border border-[color:var(--border)] text-[color:var(--text-primary)] px-6"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
