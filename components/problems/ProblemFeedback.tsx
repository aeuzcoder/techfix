'use client';

import React, { useState, useEffect } from 'react';
import { Star, Send, Loader2, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

interface FeedbackProps {
  problemId: string;
}

export function ProblemFeedback({ problemId }: FeedbackProps) {
  const { user } = useCurrentUser();
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    rating: 0,
    message: ''
  });

  useEffect(() => {
    fetchFeedbacks();
  }, [problemId]);

  const fetchFeedbacks = async () => {
    try {
      const data = await apiClient.fetch(`/api/feedback?problemId=${problemId}`);
      setFeedbacks(data);
    } catch (e) {
      console.error('Failed to load feedbacks', e);
    } finally {
      setFetching(false);
    }
  };

  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rating === 0) return toast.error("Iltimos baholang!");
    if (!formData.message.trim()) return toast.error("Iltimos fikringizni yozing!");

    try {
      setLoading(true);
      await apiClient.fetch('/api/feedback', {
        method: 'POST',
        body: JSON.stringify({
          problemId,
          email: user?.email || 'guest@techfix.uz',
          name: user?.name || 'Mehmon',
          message: formData.message,
          rating: formData.rating,
        })
      });
      toast.success("Rahmat! Fikringiz qabul qilindi.");
      setFormData({ rating: 0, message: '' });
      fetchFeedbacks(); // refresh list
    } catch (error: any) {
      toast.error(error.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 space-y-8 border-t border-[color:var(--border)] pt-8">
      <h3 className="text-xl font-bold">Fikr va Mulohazalar</h3>

      {/* Write Feedback Form */}
      <Card className="card-custom bg-[color:var(--bg-card)] border-[color:var(--border)] p-6">
        <form onSubmit={submitFeedback} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-[color:var(--border)] pb-6">
            <label className="text-sm font-semibold text-[color:var(--text-primary)] whitespace-nowrap">
              Ushbu yechimga baho bering:
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({...formData, rating: star})}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    formData.rating >= star 
                      ? 'bg-[color:var(--accent)]/10 text-yellow-500 scale-110' 
                      : 'bg-[color:var(--bg-secondary)] text-[color:var(--text-muted)] hover:bg-[color:var(--bg-secondary)]/80 hover:scale-105'
                  }`}
                >
                  <Star className={`w-5 h-5 ${formData.rating >= star ? 'fill-yellow-500' : ''}`} />
                </button>
              ))}
            </div>
            {formData.rating > 0 && (
              <span className="text-[color:var(--accent)] text-sm font-medium ml-2">
                {formData.rating} / 5
              </span>
            )}
          </div>

          <div className="space-y-3">
            <textarea 
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full h-24 p-4 bg-[color:var(--bg-secondary)] border border-[color:var(--border)] rounded-xl outline-none focus:border-[color:var(--accent)] transition-colors text-[color:var(--text-primary)] resize-none text-sm"
              placeholder="Fikr yoki savolingizni yozib qoldiring..."
            ></textarea>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full sm:w-auto btn-custom bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] text-white gap-2 rounded-xl"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Yuborish</>}
          </Button>
        </form>
      </Card>

      {/* Feedback List */}
      <div className="space-y-4">
        {fetching ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[color:var(--text-muted)]" />
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-8 text-[color:var(--text-muted)] text-sm">
            Hali xech qanday fikr yozilmagan. Birinchi bo'lib yozing!
          </div>
        ) : (
          feedbacks.map((fb) => (
            <Card key={fb._id} className="card-custom bg-[color:var(--bg-card)] border-[color:var(--border)] p-4 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[color:var(--accent)] flex items-center justify-center text-white shrink-0 font-bold text-sm">
                {fb.userId?.name?.charAt(0)?.toUpperCase() || fb.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[color:var(--text-primary)] text-sm">
                    {fb.userId?.name || fb.name || 'Foydalanuvchi'}
                  </span>
                  <span className="text-xs text-[color:var(--text-muted)]">
                    {new Date(fb.createdAt).toLocaleDateString('uz-UZ')}
                  </span>
                </div>
                {fb.rating > 0 && (
                  <div className="flex gap-1 py-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`w-3 h-3 ${star <= fb.rating ? 'fill-yellow-500 text-yellow-500' : 'text-[color:var(--border)]'}`} />
                    ))}
                  </div>
                )}
                <p className="text-[14px] text-[color:var(--text-secondary)] whitespace-pre-wrap mt-1">
                  {fb.message}
                </p>
                {fb.adminReply && (
                  <div className="mt-3 bg-[color:var(--bg-secondary)] p-3 rounded-lg border-l-2 border-[color:var(--accent)]">
                    <p className="text-xs font-semibold text-[color:var(--accent)] mb-1">Admin javobi:</p>
                    <p className="text-sm text-[color:var(--text-primary)]">{fb.adminReply}</p>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
