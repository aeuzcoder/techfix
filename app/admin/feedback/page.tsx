'use client';

import React, { useEffect, useState } from 'react';
import { MessageSquare, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replying, setReplying] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await apiClient.fetch('/api/feedback');
      setFeedback(data || []);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReply = async (id: string) => {
    if (!replyText.trim()) return;
    try {
      await apiClient.fetch(`/api/feedback/${id}/reply`, {
        method: 'PUT',
        body: JSON.stringify({ reply: replyText })
      });
      toast.success('Javob yuborildi');
      setReplying(null);
      setReplyText('');
      fetchData();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-purple-500" /> Foydalanuvchi fikrlari
        </h1>
      </div>

      <div className="space-y-4">
        {loading ? (
             <div className="text-center p-8 text-[color:var(--text-muted)]">Yuklanmoqda...</div>
        ) : feedback.length === 0 ? (
             <div className="text-center p-8 bg-[color:var(--bg-card)] border border-[color:var(--border)] rounded-xl text-[color:var(--text-muted)]">Hali fikrlar yo'q</div>
        ) : (
          feedback.map(f => (
            <div key={f._id} className="card-custom bg-[color:var(--bg-card)] border-[color:var(--border)] p-5">
               <div className="flex justify-between items-start mb-3">
                 <div>
                   <h4 className="font-bold text-[color:var(--text-primary)]">{f.userId?.name || 'Anonim foydalanuvchi'}</h4>
                   <p className="text-xs text-[color:var(--text-muted)]">{f.userId?.email || 'email yo\'q'}</p>
                 </div>
                 <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded text-xs font-bold border border-yellow-500/20">
                   {f.rating} ★
                 </div>
               </div>
               
               <p className="text-[15px] text-[color:var(--text-secondary)] mb-4 p-3 bg-[color:var(--bg-secondary)] rounded-lg border border-[color:var(--border)]">
                 {f.message}
               </p>

               {f.reply ? (
                  <div className="pr-4 pl-4 py-3 border-l-2 border-purple-500 bg-purple-500/5 rounded-r-lg mt-4">
                    <p className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider mb-1 font-bold text-purple-500">Admin javobi</p>
                    <p className="text-sm text-[color:var(--text-primary)]">{f.reply}</p>
                  </div>
               ) : (
                  <div>
                    {replying === f._id ? (
                      <div className="flex gap-2 mt-4">
                        <Input 
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          placeholder="Javobingizni yozing..."
                          className="bg-[color:var(--bg-secondary)] border-[color:var(--border)] h-9 text-sm"
                        />
                        <Button 
                          onClick={() => handleReply(f._id)}
                          size="sm" 
                          className="bg-purple-500 hover:bg-purple-600 text-white h-9"
                        >
                          Yuborish
                        </Button>
                        <Button 
                          onClick={() => {setReplying(null); setReplyText('');}}
                          size="sm" variant="ghost" className="h-9 hover:bg-[color:var(--bg-secondary)]"
                        >
                          Bekor
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => setReplying(f._id)}
                        variant="ghost" 
                        size="sm" 
                        className="text-purple-500 hover:bg-purple-500/10 mt-2 gap-2 h-8"
                      >
                        <Reply className="w-4 h-4" /> Javob yozish
                      </Button>
                    )}
                  </div>
               )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
