'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUiStore } from '@/store/ui.store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuth();
  const { theme } = useUiStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <>{children}</>;
}
