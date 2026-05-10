'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lock } from 'lucide-react';

interface PremiumGateProps {
  requiredPlan: 'premium' | 'pro';
  children: React.ReactNode;
  userPlan?: 'free' | 'premium' | 'pro';
}

export function PremiumGate({ requiredPlan, children, userPlan = 'free' }: PremiumGateProps) {
  const hasAccess = 
    requiredPlan === 'premium' ? ['premium', 'pro'].includes(userPlan) : userPlan === 'pro';

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="opacity-40 blur-[2px] pointer-events-none select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10 rounded-xl p-4 text-center">
        <div className="bg-[color:var(--bg-card)] border border-[color:var(--border)] p-4 rounded-xl flex flex-col items-center max-w-[280px]">
          <Lock className="w-8 h-8 text-[color:var(--accent)] mb-3" />
          <h4 className="font-semibold text-white mb-2">Pro/Premium kerak</h4>
          <p className="text-sm text-[color:var(--text-muted)] mb-4">
            Bu funksiya {requiredPlan === 'premium' ? 'Premium' : 'Pro'} tarifini talab qiladi.
          </p>
          <Link 
            href="/pricing"
            className="w-full btn-custom bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] text-white"
          >
            Yangilash &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
