'use client';

import React, { useEffect, useState } from 'react';
import { Search, Shield, User, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await apiClient.fetch('/api/admin/users');
      setUsers(data || []);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdatePlan = async (id: string, newPlan: string) => {
    try {
      await apiClient.fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ plan: newPlan })
      });
      toast.success('Tarif yangilandi');
      fetchData();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const filtered = users.filter((u: any) => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Foydalanuvchilar ({users.length})</h1>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--text-muted)]" />
        <Input 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-[color:var(--bg-card)] border-[color:var(--border)]"
          placeholder="Ism yoki email orqali qidirish..."
        />
      </div>

      <div className="card-custom bg-[color:var(--bg-card)] border-[color:var(--border)] p-0 overflow-hidden">
        <Table>
          <TableHeader className="bg-[color:var(--bg-secondary)]">
            <TableRow className="border-[color:var(--border)] hover:bg-transparent">
              <TableHead>Foydalanuvchi</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Tarif</TableHead>
              <TableHead className="text-right">Ro'yxatdan o'tgan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Yuklanmoqda...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-[color:var(--text-muted)]">Natija topilmadi</TableCell></TableRow>
            ) : (
              filtered.map((u) => (
                <TableRow key={u._id} className="border-[color:var(--border)] hover:bg-[color:var(--bg-secondary)]">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[color:var(--bg-secondary)] border border-[color:var(--border)] flex items-center justify-center text-[color:var(--text-secondary)] shrink-0 overflow-hidden">
                        {u.avatar ? <img src={u.avatar} alt="." /> : <User className="w-4 h-4" />}
                      </div>
                      <span className="font-medium text-[color:var(--text-primary)]">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[color:var(--text-muted)] text-sm">{u.email}</TableCell>
                  <TableCell>
                    {u.role === 'admin' ? (
                      <span className="badge-custom bg-purple-500/10 text-purple-400 border border-purple-500/20 gap-1">
                        <Shield className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className="badge-custom bg-[color:var(--bg-secondary)] border text-[color:var(--text-muted)]">User</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {u.role !== 'admin' ? (
                      <select 
                        value={u.plan} 
                        onChange={e => handleUpdatePlan(u._id, e.target.value)}
                        className="bg-[color:var(--bg-secondary)] border border-[color:var(--border)] rounded text-xs px-2 py-1 outline-none capitalize focus:border-[color:var(--accent)] cursor-pointer"
                      >
                        <option value="free">Free</option>
                        <option value="premium">Premium</option>
                        <option value="pro">Pro</option>
                      </select>
                    ) : (
                      <span className="text-xs text-[color:var(--text-muted)]">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-[color:var(--text-muted)] text-sm font-mono">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
