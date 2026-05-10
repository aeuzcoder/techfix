'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdvisorCard } from '@/components/consultation/AdvisorCard';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { apiClient } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Copy, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ConsultationPage() {
  const { user } = useCurrentUser();
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [myConsultations, setMyConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMy, setLoadingMy] = useState(true);

  const fetchMy = async () => {
    try {
      setLoadingMy(true);
      const data = await apiClient.fetch('/api/consultations/my');
      setMyConsultations(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMy(false);
    }
  };

  useEffect(() => {
    apiClient.fetch('/api/consultations/advisors')
      .then(data => {
        setAdvisors(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetchMy();
  }, []);

  const handleCancel = async (id: string) => {
    if (!window.confirm("Rostdan ham bekor qilmoqchimisiz?")) return;
    try {
      await apiClient.fetch(`/api/consultations/${id}/cancel`, { method: 'PUT' });
      toast.success("Bekor qilindi");
      fetchMy();
    } catch (e: any) {
      toast.error(e.message || "Xato yuz berdi");
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Nusxa olindi");
  };

  const isPro = user?.plan === 'pro';

  return (
    <div className="space-y-10">
      
      {!isPro && (
        <div className="bg-[rgba(245,165,36,0.06)] border-l-4 border-[color:var(--warning)] p-4 text-[15px] flex flex-col sm:flex-row justify-between items-start sm:items-center rounded-r-lg gap-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-[color:var(--warning)] shrink-0 mt-0.5" />
            <div className="text-[color:var(--text-primary)]">
              Bu xizmat faqat Pro foydalanuvchilar uchun. Texnik bilan bevosita video qo'ng'iroqda muammoingizni hal qiling.
            </div>
          </div>
          <Link href="/pricing" className="btn-custom bg-[color:var(--warning)] text-[#0e0e11] hover:bg-yellow-500 shrink-0 whitespace-nowrap px-4 font-semibold">
            Pro ga o'tish &rarr;
          </Link>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold mb-6">Texnik mutaxassislar</h1>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 bg-[color:var(--bg-secondary)] rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {advisors.map(adv => (
              <AdvisorCard key={adv._id} advisor={adv} onBookSuccess={fetchMy} />
            ))}
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-[color:var(--border)]">
        <h2 className="text-xl font-bold mb-6">Mening konsultatsiyalarim</h2>
        
        {loadingMy ? (
          <Skeleton className="h-64 w-full bg-[color:var(--bg-secondary)] rounded-xl" />
        ) : myConsultations.length === 0 ? (
          <div className="text-center py-12 text-[color:var(--text-muted)] border border-[color:var(--border)] rounded-xl bg-[color:var(--bg-card)]">
            Hali konsultatsiyalar yo'q.
          </div>
        ) : (
          <div className="border border-[color:var(--border)] rounded-xl overflow-hidden bg-[color:var(--bg-card)]">
            <Table>
              <TableHeader className="bg-[color:var(--bg-secondary)]">
                <TableRow className="border-[color:var(--border)] hover:bg-transparent">
                  <TableHead>Texnik</TableHead>
                  <TableHead>Sana + Vaqt</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uchrashuv</TableHead>
                  <TableHead className="text-right">Harakat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myConsultations.map(c => {
                  const statusColors = {
                    pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
                    confirmed: 'bg-[color:var(--success)]/10 text-[color:var(--success)] border-[color:var(--success)]/20',
                    completed: 'bg-[color:var(--accent)]/10 text-[color:var(--accent)] border-[color:var(--accent)]/20',
                    cancelled: 'bg-[color:var(--danger)]/10 text-[color:var(--danger)] border-[color:var(--danger)]/20',
                  };
                  return (
                    <TableRow key={c._id} className="border-[color:var(--border)] hover:bg-[color:var(--bg-secondary)]">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[color:var(--accent)] overflow-hidden shrink-0">
                            {c.advisorId?.avatar && <img src={c.advisorId.avatar} className="w-full h-full object-cover" alt="" />}
                          </div>
                          <span className="font-medium text-[color:var(--text-primary)]">{c.advisorId?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-[color:var(--text-muted)]">
                        {c.date} | {c.timeSlot}
                      </TableCell>
                      <TableCell>
                        <span className={`badge-custom border px-2 py-0.5 ${(statusColors as any)[c.status]}`}>
                          {c.status.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        {c.meetUrl && c.status !== 'cancelled' ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[color:var(--accent)] truncate max-w-[150px]">{c.meetUrl}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-[color:var(--text-muted)] hover:text-white" onClick={() => copyUrl(c.meetUrl)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-[color:var(--text-muted)]">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {(c.status === 'pending' || c.status === 'confirmed') && (
                          <Button 
                            onClick={() => handleCancel(c._id)}
                            variant="ghost" 
                            size="sm" 
                            className="text-[color:var(--danger)] hover:text-red-400 hover:bg-[color:var(--danger)]/10"
                          >
                            <XCircle className="w-4 h-4 mr-1" /> Bekor qilish
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

    </div>
  );
}
