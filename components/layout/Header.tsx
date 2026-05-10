'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Sun, Moon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const getTitleFromPath = (path: string) => {
  if (path.startsWith('/dashboard')) return 'Dashboard';
  if (path.startsWith('/software')) return 'Software';
  if (path.startsWith('/hardware')) return 'Hardware';
  if (path.startsWith('/advisor')) return 'Noutbuk Maslahatchi';
  if (path.startsWith('/consultation')) return 'Konsultatsiya';
  if (path.startsWith('/history')) return 'Tarix';
  if (path.startsWith('/pricing')) return 'Narxlar';
  if (path.startsWith('/profile')) return 'Profil';
  if (path.startsWith('/search')) return 'Qidiruv';
  if (path.startsWith('/problem')) return 'Muammo tahlili';
  return 'TechFix';
};

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useUiStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <header
        className="h-14 fixed top-0 right-0 left-0 md:left-[220px] z-30 flex items-center justify-between px-4 sm:px-6 border-b border-[color:var(--border)]"
        style={{ background: 'var(--bg-primary)', backdropFilter: 'blur(12px)' }}
      >
        {/* Left: page title (desktop) / mobile logo placeholder */}
        <div className="flex items-center gap-3 pl-10 md:pl-0">
          <h3 className="hidden md:block text-[15px] font-semibold text-[color:var(--text-primary)]">
            {getTitleFromPath(pathname)}
          </h3>
          <span className="md:hidden text-base font-bold text-[color:var(--text-primary)]">
            Tech<span style={{ color: 'var(--accent)' }}>Fix</span>
          </span>
        </div>

        {/* Center: search */}
        <div className="flex-1 max-w-xs sm:max-w-md px-3 hidden sm:block">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--text-muted)]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 w-full rounded-full text-sm border-[color:var(--border)] placeholder:text-[color:var(--text-muted)] focus-visible:ring-[color:var(--accent)]"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              placeholder="Qidirish..."
            />
          </form>
        </div>

        {/* Right: theme + lang + user */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-secondary)] transition-colors"
            title={theme === 'dark' ? 'Kunduz rejimi' : 'Tun rejimi'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <LanguageSwitcher />

          {/* User avatar link to profile */}
          <Link
            href="/profile"
            className="w-8 h-8 rounded-full border flex items-center justify-center hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
          >
            <span className="text-xs font-medium text-[color:var(--text-primary)]">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </Link>
        </div>
      </header>

      {/* Logout confirmation dialog */}
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
          <AlertDialogHeader>
            <AlertDialogTitle>Tizimdan chiqishni tasdiqlaysizmi?</AlertDialogTitle>
            <AlertDialogDescription style={{ color: 'var(--text-muted)' }}>
              Chiqsangiz, qayta kirish uchun email va parolingizni kiritishingiz kerak bo&apos;ladi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}>
              Bekor qilish
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              style={{ background: 'var(--danger)', color: '#fff', border: 'none' }}
            >
              Chiqish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
