'use client';

import React, { useState } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Mail, Shield, Smartphone, Pen, Save, Loader2, Trash2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/auth.store';
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

export default function ProfilePage() {
  const { user, isLoading } = useCurrentUser();
  const { logout, setUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  // Keep form synced when user loads
  React.useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', phone: user.phone || '' });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await apiClient.fetch('/api/auth/me', {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      if (updated && user) setUser({ ...user, ...formData });
      toast.success("Profil yangilandi");
      setEditing(false);
    } catch (e: any) {
      toast.error(e.message || "Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await apiClient.fetch('/api/auth/me', { method: 'DELETE' });
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        await firebaseUser.delete();
      }
      logout();
      toast.success("Akkaunt o'chirildi");
    } catch (e: any) {
      toast.error("Firebase'dan qayta kirishingiz kerak bo'lishi mumkin: " + e.message);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[color:var(--accent)]" /></div>;
  if (!user) return null;

  return (
    <div className="max-w-[800px] w-full mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-6">Mening Profilim</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar Card */}
        <Card className="card-custom bg-[color:var(--bg-card)] border-[color:var(--border)] p-6 flex flex-col items-center justify-center w-full md:w-1/3 min-h-[250px]">
          <div className="w-24 h-24 rounded-full bg-[color:var(--accent)] flex items-center justify-center text-white text-3xl font-bold mb-4 border-4 border-[color:var(--bg-secondary)]">
            {user.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <h2 className="text-xl font-bold text-center mb-1 text-[color:var(--text-primary)]">{user.name}</h2>
          <span className="badge-custom bg-[color:var(--bg-secondary)] text-[color:var(--text-secondary)] border border-[color:var(--border)] capitalize">
            {user.plan} Tarif
          </span>
        </Card>

        {/* Info Card */}
        <Card className="card-custom bg-[color:var(--bg-card)] border-[color:var(--border)] p-6 flex-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Shaxsiy ma'lumotlar</h3>
            {!editing ? (
              <Button onClick={() => setEditing(true)} variant="outline" size="sm" className="btn-custom border-[color:var(--border)] bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] hover:bg-[color:var(--bg-card)] gap-2">
                <Pen className="w-4 h-4" /> Tahrirlash
              </Button>
            ) : (
              <Button onClick={handleSave} disabled={saving} size="sm" className="btn-custom bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] text-white gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Saqlash
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 py-2 border-b border-[color:var(--border)]">
              <User className="w-5 h-5 text-[color:var(--text-muted)]" />
              <div className="flex-1">
                <p className="text-xs text-[color:var(--text-muted)] mb-1">Ism</p>
                {editing ? (
                  <Input 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="h-8 text-sm input-custom" 
                  />
                ) : (
                  <p className="text-sm font-medium">{user.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 py-2 border-b border-[color:var(--border)]">
              <Mail className="w-5 h-5 text-[color:var(--text-muted)]" />
              <div className="flex-1">
                <p className="text-xs text-[color:var(--text-muted)] mb-1">Email</p>
                <p className="text-sm font-medium text-[color:var(--text-secondary)] select-none cursor-not-allowed opacity-80">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-2 border-b border-[color:var(--border)]">
              <Smartphone className="w-5 h-5 text-[color:var(--text-muted)]" />
              <div className="flex-1">
                <p className="text-xs text-[color:var(--text-muted)] mb-1">Telefon rakam</p>
                {editing ? (
                  <Input 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    placeholder="+998 90 123 45 67"
                    className="h-8 text-sm input-custom" 
                  />
                ) : (
                  <p className="text-sm font-medium">{user.phone || <span className="text-[color:var(--text-muted)] italic">Kiritilmagan</span>}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 py-2 border-b border-[color:var(--border)]">
              <Shield className="w-5 h-5 text-[color:var(--text-muted)]" />
              <div className="flex-1">
                <p className="text-xs text-[color:var(--text-muted)] mb-1">Rol</p>
                <p className="text-sm font-medium capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="pt-8 mt-8 border-t border-[color:var(--border)] flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="text-[color:var(--danger)] border-[color:var(--danger)] bg-transparent hover:bg-[color:var(--danger)]/10 btn-custom gap-2">
              <Trash2 className="w-4 h-4" /> Akkauntni o'chirish
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[color:var(--bg-card)] border-[color:var(--border)] text-[color:var(--text-primary)]">
            <AlertDialogHeader>
              <AlertDialogTitle>Akkauntni butunlay o'chirish</AlertDialogTitle>
              <AlertDialogDescription className="text-[color:var(--text-muted)]">
                Sizning barcha ma'lumotlaringiz, tarixingiz va tarifingiz tizimdan butunlay o'chib ketadi. Buni ortga qaytarib bo'lmaydi.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="btn-custom bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border-[color:var(--border)]">Bekor qilish</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount} className="btn-custom bg-[color:var(--danger)] text-white hover:bg-red-600 border-0">O'chirish</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
