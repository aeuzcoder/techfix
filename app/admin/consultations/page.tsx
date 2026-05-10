'use client';

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiClient } from '@/lib/api-client';

export default function AdminConsultationsPage() {
  const [loading, setLoading] = useState(true);

  // Note: For MVP mock purposes, we reuse the /api/admin/stats data or just show a placeholder
  // because we didn't build a dedicated /api/admin/consultations endpoint yet.
  
  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mavjud Konsultatsiyalar</h1>
      </div>

      <div className="card-custom bg-[color:var(--bg-card)] border-[color:var(--border)] p-0 overflow-hidden">
        <Table>
          <TableHeader className="bg-[color:var(--bg-secondary)]">
            <TableRow className="border-[color:var(--border)] hover:bg-transparent">
              <TableHead>Mijoz</TableHead>
              <TableHead>Texnik</TableHead>
              <TableHead>Sana & Vaqt</TableHead>
              <TableHead>Holat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8">Yuklanmoqda...</TableCell></TableRow>
            ) : (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-[color:var(--text-muted)]">Ma'lumot topilmadi</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
