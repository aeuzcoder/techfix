'use client';

import React, { useState, useEffect } from 'react';
import { User, CalendarCheck, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

interface AdvisorCardProps {
  advisor: any;
  onBookSuccess: () => void;
}

export function AdvisorCard({ advisor, onBookSuccess }: AdvisorCardProps) {
  const { user } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slots, setSlots] = useState<string[]>([]);
  
  // Dates: today + next 6 days
  const tempDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);

  const isPro = user?.plan === 'pro';

  useEffect(() => {
    if (selectedDate && open) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      setLoadingSlots(true);
      apiClient.fetch(`/api/consultations/advisors/${advisor._id}/slots?date=${dateStr}`)
        .then(data => {
          setSlots(data || []);
          setSelectedTime(null);
        })
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedDate, open, advisor._id]);

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) return toast.error("Vaqtni tanlang");
    
    try {
      setBooking(true);
      const dateStr = selectedDate.toISOString().split('T')[0];
      await apiClient.fetch('/api/consultations/book', {
        method: 'POST',
        body: JSON.stringify({
          advisorId: advisor._id,
          date: dateStr,
          timeSlot: selectedTime
        })
      });
      toast.success("Konsultatsiya band qilindi!");
      setOpen(false);
      onBookSuccess();
    } catch (e: any) {
      toast.error(e.message || "Band qilishda xatolik");
    } finally {
      setBooking(false);
    }
  };

  return (
    <Card className="card-custom group flex flex-col h-full bg-[color:var(--bg-card)] border-[color:var(--border)]">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-[color:var(--accent)] flex items-center justify-center text-white shrink-0 overflow-hidden">
          {advisor.avatar ? <img src={advisor.avatar} alt={advisor.name} /> : <User className="w-6 h-6" />}
        </div>
        <div>
          <h3 className="font-semibold text-lg leading-tight mb-1">{advisor.name}</h3>
          <p className="text-sm text-[color:var(--text-muted)] line-clamp-1">
            {advisor.specialization?.join(', ')}
          </p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">★</span>
          <span className="font-medium text-[color:var(--text-primary)]">{advisor.rating}</span>
          <span className="text-[color:var(--text-muted)]">({advisor.reviewCount} sharh)</span>
        </div>
        <span className={`badge-custom ${advisor.isAvailable ? 'bg-[color:var(--success)]/10 text-[color:var(--success)]' : 'bg-[color:var(--bg-secondary)] text-[color:var(--text-muted)]'}`}>
          {advisor.isAvailable ? 'Bo\'sh' : 'Band'}
        </span>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            disabled={!advisor.isAvailable || !isPro}
            className="w-full mt-auto btn-custom bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] hover:bg-[color:var(--accent)] hover:text-white border border-[color:var(--border)] transition-colors"
          >
            Vaqt band qilish
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-[color:var(--bg-card)] border-[color:var(--border)] text-[color:var(--text-primary)] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Vaqt band qilish: {advisor.name}</DialogTitle>
          </DialogHeader>
          
          <div className="my-4">
            <h4 className="text-sm font-medium mb-3">Sanani tanlang</h4>
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {tempDates.map((d, i) => {
                const isSelected = selectedDate?.toDateString() === d.toDateString();
                const dayName = d.toLocaleDateString('uz-UZ', { weekday: 'short' });
                const dateNum = d.getDate();
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(d)}
                    className={`flex flex-col items-center p-2 min-w-[60px] rounded-xl border transition-colors ${
                      isSelected 
                        ? 'bg-[color:var(--accent)] border-[color:var(--accent)] text-white' 
                        : 'bg-[color:var(--bg-secondary)] border-[color:var(--border)] hover:border-[color:var(--accent-hover)] text-[color:var(--text-muted)]'
                    }`}
                  >
                    <span className="text-[10px] uppercase mb-1">{dayName}</span>
                    <span className="text-lg font-bold leading-none">{dateNum}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDate && (
            <div className="mb-4 min-h-[120px]">
              <h4 className="text-sm font-medium mb-3">Vaqtni tanlang</h4>
              {loadingSlots ? (
                <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-[color:var(--accent)]" /></div>
              ) : slots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {slots.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 text-sm rounded-lg border font-medium transition-colors ${
                        selectedTime === time
                          ? 'bg-[color:var(--accent)] border-[color:var(--accent)] text-white'
                          : 'bg-[color:var(--bg-secondary)] border-[color:var(--border)] hover:border-[color:var(--accent-hover)] text-[color:var(--text-primary)]'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[color:var(--text-muted)] p-4 text-center border border-[color:var(--border)] border-dashed rounded-lg">
                  Bu kunda bo'sh vaqt yo'q
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-[color:var(--border)]">
            <div>
              <p className="text-xs text-[color:var(--text-muted)]">Narx</p>
              <p className="font-bold text-lg">50,000 so'm</p>
            </div>
            <Button 
              onClick={handleBook}
              disabled={!selectedDate || !selectedTime || booking}
              className="btn-custom bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] text-white px-8"
            >
              {booking ? 'Kutib turing...' : 'Tasdiqlash'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
