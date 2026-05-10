'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Users, FileText, CalendarCheck, MessageSquare, TrendingUp, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/lib/api-client';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.fetch('/api/admin/stats')
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Statistika</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 bg-[color:var(--bg-secondary)] rounded-xl" />)}
        </div>
        <Skeleton className="h-64 bg-[color:var(--bg-secondary)] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Umumiy ko'rsatkichlar</h1>
        <p className="text-[color:var(--text-muted)]">Platformaning joriy holati</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-b border-[color:var(--border)] pb-8">
        <StatCard 
          icon={Users} 
          title="Foydalanuvchilar" 
          value={stats?.totalUsers || 0} 
          trend="+12% bu hafta" 
          color="text-blue-500" 
          bg="bg-blue-500/10" 
        />
        <StatCard 
          icon={FileText} 
          title="Muammolar" 
          value={stats?.totalProblems || 0} 
          trend="+2 yangi" 
          color="text-purple-500" 
          bg="bg-purple-500/10" 
        />
        <StatCard 
          icon={CalendarCheck} 
          title="Band qilingan vaqtlar" 
          value={stats?.totalConsultations || 0} 
          trend="8 ta bugun" 
          color="text-green-500" 
          bg="bg-green-500/10" 
        />
        <StatCard 
          icon={MessageSquare} 
          title="Feedbacklar" 
          value={stats?.totalFeedback || 0} 
          trend="Javob kutilmoqda" 
          color="text-yellow-500" 
          bg="bg-yellow-500/10" 
        />
      </div>

      <div>
         <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
           <TrendingUp className="w-5 h-5 text-[color:var(--accent)]" />
           Eng ko'p o'qilganlar
         </h2>

         <div className="card-custom bg-[color:var(--bg-card)] border-[color:var(--border)] p-0 overflow-hidden">
           {stats?.popularProblems?.length > 0 ? (
             <div className="divide-y divide-[color:var(--border)]">
               {stats.popularProblems.map((p: any, i: number) => (
                 <div key={p._id} className="flex items-center p-4 hover:bg-[color:var(--bg-secondary)] transition-colors">
                   <div className="w-8 h-8 rounded-full bg-[color:var(--bg-secondary)] text-[color:var(--text-muted)] flex items-center justify-center font-bold text-sm shrink-0 font-mono">
                     {i + 1}
                   </div>
                   <div className="ml-4 flex-1">
                     <p className="font-medium text-[color:var(--text-primary)]">{p.name?.uz || 'Nomsiz'}</p>
                     <p className="text-xs text-[color:var(--text-muted)] mt-0.5">{p.category} &bull; {p.subcategory}</p>
                   </div>
                   <div className="text-right">
                     <div className="text-lg font-bold text-[color:var(--text-primary)]">{p.viewCount}</div>
                     <p className="text-xs text-[color:var(--text-muted)] mt-0.5">ko'rish</p>
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="p-8 text-center text-[color:var(--text-muted)] flex flex-col items-center">
               <Search className="w-8 h-8 mb-3 opacity-20" />
               Hali ma'lumot yo'q
             </div>
           )}
         </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, trend, color, bg }: any) {
  return (
    <Card className="card-custom bg-[color:var(--bg-card)] border-[color:var(--border)] p-5">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-right">
          <p className="text-[color:var(--text-secondary)] text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-[color:var(--text-primary)]">{value}</h3>
        </div>
      </div>
      <div className="text-xs text-[color:var(--text-muted)] text-right -mb-1">{trend}</div>
    </Card>
  );
}
