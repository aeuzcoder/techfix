'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminProblemsPage() {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editItem, setEditItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: { uz: '', ru: '', en: '' },
    slug: '',
    category: 'software',
    subcategory: '',
    steps: [] as any[],
    // other fields skipped for brevity in this MVP, they should ideally be fully managed
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await apiClient.fetch('/api/problems');
      setProblems(data || []);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAdd = () => {
    setEditItem(null);
    setFormData({
      name: { uz: '', ru: '', en: '' },
      slug: '',
      category: 'software',
      subcategory: '',
      steps: []
    });
    setIsModalOpen(true);
  };

  const openEdit = (p: any) => {
    setEditItem(p);
    setFormData({
      name: p.name || { uz: '', ru: '', en: '' },
      slug: p.slug || '',
      category: p.category || 'software',
      subcategory: p.subcategory || '',
      steps: p.steps || []
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Haqiqatan ham o`chirmoqchimisiz?')) return;
    try {
      await apiClient.fetch(`/api/admin/problems/${id}`, { method: 'DELETE' });
      toast.success('O`chirildi');
      fetchData();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editItem ? `/api/admin/problems/${editItem._id}` : '/api/admin/problems';
      const method = editItem ? 'PUT' : 'POST';
      
      await apiClient.fetch(url, {
        method,
        body: JSON.stringify(formData)
      });
      
      toast.success('Saqlandi');
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filtered = problems.filter((p: any) => 
    p.name?.uz?.toLowerCase().includes(search.toLowerCase()) || 
    p.slug?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Muammolar baza</h1>
        <Button onClick={openAdd} className="btn-custom bg-purple-500 hover:bg-purple-600 text-white gap-2">
          <Plus className="w-4 h-4" /> Yangi qo'shish
        </Button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--text-muted)]" />
        <Input 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-[color:var(--bg-card)] border-[color:var(--border)]"
          placeholder="Qidirish (Nomi, URL)..."
        />
      </div>

      <div className="card-custom bg-[color:var(--bg-card)] border-[color:var(--border)] p-0 overflow-hidden">
        <Table>
          <TableHeader className="bg-[color:var(--bg-secondary)]">
            <TableRow className="border-[color:var(--border)] hover:bg-transparent">
              <TableHead>Nomi (UZ)</TableHead>
              <TableHead>Kategoriya</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Ko'rish</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Yuklanmoqda...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-[color:var(--text-muted)]">Natija topilmadi</TableCell></TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p._id} className="border-[color:var(--border)] hover:bg-[color:var(--bg-secondary)]">
                  <TableCell className="font-medium max-w-[200px] truncate">{p.name?.uz}</TableCell>
                  <TableCell>
                    <span className="badge-custom bg-[color:var(--bg-secondary)] border">{p.category} &bull; {p.subcategory}</span>
                  </TableCell>
                  <TableCell className="text-[color:var(--text-muted)] text-sm font-mono">{p.slug}</TableCell>
                  <TableCell>
                    <Link href={`/problem/${p.slug}`} target="_blank" className="text-purple-500 hover:underline flex items-center gap-1">
                       <ExternalLink className="w-3 h-3"/> Ko'rish
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)} className="text-blue-500 hover:bg-blue-500/10">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p._id)} className="text-[color:var(--danger)] hover:bg-[color:var(--danger)]/10 ml-2">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[color:var(--bg-card)] border-[color:var(--border)] text-[color:var(--text-primary)] sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Muammoni tahrirlash' : 'Yangi muammo'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm">Nomi (UZ)</label>
              <Input 
                required 
                value={formData.name.uz} 
                onChange={e => setFormData({...formData, name: {...formData.name, uz: e.target.value}})} 
                className="bg-[color:var(--bg-secondary)] border-[color:var(--border)]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">URL Slug</label>
              <Input 
                required 
                value={formData.slug} 
                onChange={e => setFormData({...formData, slug: e.target.value})} 
                className="bg-[color:var(--bg-secondary)] border-[color:var(--border)] font-mono text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm">Asosiy Kategoriya</label>
                <select 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full h-10 px-3 bg-[color:var(--bg-secondary)] border border-[color:var(--border)] rounded-md outline-none focus:border-purple-500 text-sm"
                >
                  <option value="software">Software</option>
                  <option value="hardware">Hardware</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm">Quyi kategoriya (Subcategory)</label>
                <Input 
                  required 
                  value={formData.subcategory} 
                  onChange={e => setFormData({...formData, subcategory: e.target.value})} 
                  className="bg-[color:var(--bg-secondary)] border-[color:var(--border)]"
                  placeholder="Mac OS, Windows vh"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[color:var(--border)] flex justify-end gap-3 mt-8">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="border-[color:var(--border)] bg-[color:var(--bg-secondary)] hover:bg-[color:var(--bg-secondary)]/80 text-white">
                Bekor qilish
              </Button>
              <Button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white border-0">
                Saqlash
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
