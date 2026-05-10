'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Download, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import { apiClient } from '@/lib/api-client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { PremiumGate } from '@/components/shared/PremiumGate';
import { useUiStore } from '@/store/ui.store';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const { user } = useCurrentUser();
  const { language } = useUiStore();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const data = await apiClient.fetch('/api/history');
      setHistory(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClear = async () => {
    try {
      await apiClient.fetch('/api/history', { method: 'DELETE' });
      toast.success("Tarix tozalandi");
      setHistory([]);
    } catch (e: any) {
      toast.error("Xato: " + e.message);
    }
  };

  const handleExport = async () => {
    try {
      if (user?.plan === 'free') {
         return toast.error("Export qilish uchun Premium kerak");
      }
      const blob = await apiClient.fetch('/api/history/export');
      if (blob) {
        const url = window.URL.createObjectURL(blob as Blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'history.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (e: any) {
      toast.error('Eksport qilib bo\'lmadi');
    }
  };


  if (loading) return <div>Yuklanmoqda...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Clock className="w-6 h-6 text-[color:var(--accent)]" /> 
          Ko'rish tarixi
        </h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button 
            onClick={handleExport}
            variant="outline" 
            className="flex-1 sm:flex-none btn-custom border-[color:var(--border)] bg-[color:var(--bg-secondary)] hover:bg-[color:var(--bg-card)] gap-2"
          >
            <Download className="w-4 h-4" /> Eksport (CSV)
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex-1 sm:flex-none btn-custom bg-[color:var(--danger)]/10 text-[color:var(--danger)] hover:bg-[color:var(--danger)]/20 border-0 gap-2">
                <Trash2 className="w-4 h-4" /> Tozalash
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[color:var(--bg-card)] border-[color:var(--border)]">
              <AlertDialogHeader>
                <AlertDialogTitle>Tarixni tozalashni tasdiqlaysizmi?</AlertDialogTitle>
                <AlertDialogDescription className="text-[color:var(--text-muted)]">
                  Bu amalni ortga qaytarib bo'lmaydi. Barcha ko'rish tarixingiz o'chiriladi.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="btn-custom bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border-[color:var(--border)]">Bekor qilish</AlertDialogCancel>
                <AlertDialogAction onClick={handleClear} className="btn-custom bg-[color:var(--danger)] text-white hover:bg-red-600">O'chirish</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {user?.plan === 'free' && (
        <div className="bg-[color:var(--bg-secondary)] border border-[color:var(--border)] p-4 rounded-xl flex items-center justify-between">
          <p className="text-sm text-[color:var(--text-muted)]">
            Premium bilan cheksiz tarix va eksport imkoniga ega bo'ling (Hozir faqat oxirgi 10 ta).
          </p>
          <Link href="/pricing" className="text-sm font-medium text-[color:var(--accent)] hover:underline ml-4 whitespace-nowrap">
            Yangilash &rarr;
          </Link>
        </div>
      )}

      {history.length === 0 ? (
        <div className="text-center py-12 text-[color:var(--text-muted)] border border-[color:var(--border)] rounded-xl bg-[color:var(--bg-card)]">
          Tarix bo'sh
        </div>
      ) : (
        <div className="border border-[color:var(--border)] rounded-xl overflow-hidden bg-[color:var(--bg-card)]">
          <Table>
            <TableHeader className="bg-[color:var(--bg-secondary)]">
              <TableRow className="border-[color:var(--border)] hover:bg-[color:var(--bg-secondary)]">
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Problem name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Ko'rilgan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item, index) => (
                <TableRow key={item._id} className="border-[color:var(--border)] hover:bg-[rgba(255,255,255,0.02)]">
                  <TableCell className="font-medium text-[color:var(--text-muted)]">{index + 1}</TableCell>
                  <TableCell>
                    {item.problemId ? (
                      <Link href={`/problem/${item.problemId.slug}`} className="hover:text-[color:var(--accent)] font-medium transition-colors">
                        {item.problemId.name?.[language] || item.problemId.name?.uz}
                      </Link>
                    ) : (
                      <span className="text-[color:var(--text-muted)]">O'chirilgan muammo</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="badge-custom bg-[color:var(--bg-secondary)] text-[color:var(--text-secondary)] border border-[color:var(--border)]">
                      {item.problemId?.category || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-[color:var(--text-muted)] text-sm">
                    {new Date(item.viewedAt).toLocaleDateString()} {new Date(item.viewedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
