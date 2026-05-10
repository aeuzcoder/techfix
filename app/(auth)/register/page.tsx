'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

const getFriendlyErrorMessage = (error: any) => {
  const code = error?.code || '';
  switch (code) {
    case 'auth/popup-closed-by-user':
      return 'Oyna yopildi. Iltimos, qayta urinib ko\'ring.';
    case 'auth/email-already-in-use':
      return 'Bu email band. Boshqa email kiriting yoki tizimga kiring.';
    case 'auth/weak-password':
      return 'Parol juda oddiy. Kamida 6 ta belgi kiriting.';
    case 'auth/invalid-email':
      return 'Email no\'to\'g\'ri formatda.';
    case 'auth/network-request-failed':
      return 'Internetga ulanishda xatolik yuz berdi.';
    case 'auth/too-many-requests':
      return 'Haddan tashqari ko\'p urinishlar. Biroz kuting.';
    default:
      return 'Kutilmagan xatolik yuz berdi. Qaytadan urining.';
  }
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terms) return toast.error('Qoidalarga rozi bo\'lishingiz kerak');
    if (password.length < 8) return toast.error('Parol kamida 8 ta belgidan iborat bo\'lishi kerak');
    if (password !== confirmPassword) return toast.error('Parollar bir xil emas');
    
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      // useAuth uses onAuthStateChanged to grab token and hitting /api/auth/verify to create the DB user
    } catch (error: any) {
      toast.error(getFriendlyErrorMessage(error));
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      toast.error(getFriendlyErrorMessage(error));
      setLoading(false);
    }
  };

  if (isLoading || isAuthenticated) return null;

  return (
    <div className="min-h-screen flex bg-[color:var(--bg-primary)] text-[color:var(--text-primary)]">
      <div className="hidden lg:flex w-1/2 bg-[#0c0c0e] flex-col justify-center p-16 border-r border-[color:var(--border)] relative overflow-hidden">
        <div className="absolute top-12 left-12 text-3xl font-bold tracking-tight text-white">
          Tech<span className="text-[#7c6dfa]">Fix</span>
        </div>
        
        <div className="max-w-md mt-12">
          <h1 className="text-4xl font-bold mb-4 leading-tight text-white">Yangi akkaunt yaratish</h1>
          <p className="text-gray-400 mb-8 text-lg">Platformaning barcha imkoniyatlaridan foydalanish uchun ro'yxatdan o'ting.</p>
          
          <ul className="space-y-4">
            {['Aniq va tushunarli qo\'llanmalar', 'Mutaxassis bilan onlayn bog\'lanish', 'AI orqali noutbuk tanlashda yordam'].map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#22c97a]" />
                <span className="text-gray-200 font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 py-12 overflow-y-auto">
        <div className="w-full max-w-md card-custom">
          <h2 className="text-2xl font-bold mb-6 text-center">Ro'yxatdan o'tish</h2>
          
          <Button 
            onClick={handleGoogleLogin} 
            disabled={loading}
            className="w-full btn-custom bg-white hover:bg-gray-100 text-[#0c0c0e] mb-6 flex items-center gap-2 border-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google orqali kiring
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[color:var(--border)]"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[color:var(--bg-card)] px-2 text-[color:var(--text-muted)]">yoki email orqali</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[color:var(--text-secondary)]">Ismingiz</label>
              <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-custom w-full"
                placeholder="Ali Valiyev"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[color:var(--text-secondary)]">Email</label>
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-custom w-full"
                placeholder="name@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[color:var(--text-secondary)]">Parol</label>
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-custom w-full"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[color:var(--text-secondary)]">Parolni tasdiqlang</label>
              <Input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-custom w-full"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input 
                type="checkbox" 
                id="terms" 
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="rounded border-[color:var(--border)] bg-[color:var(--bg-secondary)] accent-[color:var(--accent)]"
              />
              <label htmlFor="terms" className="text-sm text-[color:var(--text-secondary)] cursor-pointer">
                Foydalanish qoidalariga roziman
              </label>
            </div>
            
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full btn-custom bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] text-white mt-4"
            >
              {loading ? 'Kutib turing...' : 'Ro\'yxatdan o\'tish'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[color:var(--text-secondary)]">
            Akkaunt bormi? <Link href="/login" className="text-[color:var(--accent)] hover:underline">Kirish</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
