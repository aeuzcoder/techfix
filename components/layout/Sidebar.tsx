'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Monitor, Cpu, Sparkles, 
  Video, Clock, CreditCard, 
  User as UserIcon, LogOut, Sun, Moon, X, Menu
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const topNav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Software', href: '/software', icon: Monitor },
  { name: 'Hardware', href: '/hardware', icon: Cpu },
  { name: 'Noutbuk Maslahatchi', href: '/advisor', icon: Sparkles },
  { name: 'Konsultatsiya', href: '/consultation', icon: Video, proBadge: true },
  { name: 'Tarix', href: '/history', icon: Clock },
];

const bottomNav = [
  { name: 'Narxlar', href: '/pricing', icon: CreditCard },
  { name: 'Profil', href: '/profile', icon: UserIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useUiStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
    } catch (e) {
      console.error(e);
    }
  };

  const isPro = user?.plan === 'pro';

  const navLink = (item: { name: string; href: string; icon: React.ElementType; proBadge?: boolean }) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors text-sm font-medium ${
          isActive 
            ? 'bg-[rgba(124,109,250,0.12)] text-[color:var(--accent)] border-l-2 border-[color:var(--accent)]' 
            : 'text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-secondary)] hover:text-[color:var(--text-primary)] border-l-2 border-transparent'
        }`}
      >
        <div className="flex items-center gap-3">
          <item.icon className="w-4 h-4" />
          {item.name}
        </div>
        {item.proBadge && !isPro && (
          <span className="badge-custom bg-[color:var(--accent)] text-white text-[10px]">PRO</span>
        )}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-[color:var(--border)] shrink-0">
        <span className="text-xl font-bold tracking-tight text-[color:var(--text-primary)]">
          Tech<span className="text-[color:var(--accent)]">Fix</span>
        </span>
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-secondary)] transition-colors"
          title={theme === 'dark' ? 'Kunduz rejimi' : 'Tun rejimi'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {topNav.map(navLink)}

        <div className="pt-4 mt-4 border-t border-[color:var(--border)] space-y-1">
          {bottomNav.map(navLink)}

          {/* Logout with confirmation dialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-secondary)] hover:text-[color:var(--danger)] border-l-2 border-transparent">
                <LogOut className="w-4 h-4" />
                Chiqish
              </button>
            </AlertDialogTrigger>
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
                  style={{ background: 'var(--danger)', color: '#fff' }}
                >
                  Chiqish
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </nav>

      {/* User info link to profile */}
      <Link href="/profile" className="p-4 border-t border-[color:var(--border)] flex items-center gap-3 shrink-0 hover:bg-[color:var(--bg-secondary)] transition-colors cursor-pointer group">
        <div className="w-8 h-8 rounded-full bg-[color:var(--accent)] flex items-center justify-center text-white font-medium text-xs shrink-0 group-hover:scale-105 transition-transform">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[color:var(--text-primary)] truncate group-hover:text-[color:var(--accent)] transition-colors">{user?.name}</p>
          <p className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider">{user?.plan}</p>
        </div>
      </Link>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="fixed inset-y-0 left-0 w-[220px] border-r border-[color:var(--border)] z-40 hidden md:flex flex-col"
        style={{ background: 'var(--sidebar)' }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile: hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3 left-4 z-50 w-9 h-9 rounded-lg flex items-center justify-center text-[color:var(--text-primary)] hover:bg-[color:var(--bg-card)] border border-[color:var(--border)] transition-colors"
        style={{ background: 'var(--bg-secondary)' }}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile: overlay + drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside
            className="relative w-[260px] flex flex-col h-full border-r border-[color:var(--border)] shadow-2xl"
            style={{ background: 'var(--sidebar)' }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-[color:var(--text-muted)] hover:bg-[color:var(--bg-secondary)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
