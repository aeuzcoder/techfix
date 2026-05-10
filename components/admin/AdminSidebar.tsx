'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, Database, Users, CalendarCheck, MessageCircle, LogOut 
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const adminNav = [
  { name: 'Statistika', href: '/admin', icon: BarChart3 },
  { name: 'Muammolar', href: '/admin/problems', icon: Database },
  { name: 'Foydalanuvchilar', href: '/admin/users', icon: Users },
  { name: 'Konsultatsiyalar', href: '/admin/consultations', icon: CalendarCheck },
  { name: 'Feedbacklar', href: '/admin/feedback', icon: MessageCircle },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-[220px] bg-[#0e0e11] border-r border-[color:var(--border)] flex flex-col z-40">
      <div className="h-1 border-t-4 border-purple-500 w-full absolute top-0"></div>
      <div className="h-14 flex items-center px-6 border-b border-[color:var(--border)] mt-1">
        <span className="text-xl font-bold tracking-tight text-[color:var(--text-primary)]">
          Tech<span className="text-purple-500">Admin</span>
        </span>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {adminNav.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                isActive 
                  ? 'bg-purple-500/10 text-purple-400 border-l-2 border-purple-500' 
                  : 'text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-card)] hover:text-[color:var(--text-primary)] border-l-2 border-transparent'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[color:var(--border)]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-card)] hover:text-[color:var(--danger)] border-l-2 border-transparent"
        >
          <LogOut className="w-4 h-4" />
          Chiqish
        </button>
      </div>
    </aside>
  );
}
