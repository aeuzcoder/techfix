'use client';

import React, { useState } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Info, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

export default function PricingPage() {
  const { user } = useCurrentUser();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (plan: string) => {
    if (user?.plan === plan) return;
    
    try {
      setLoadingPlan(plan);
      const res = await apiClient.fetch('/api/payment/create', {
        method: 'POST',
        body: JSON.stringify({ plan })
      });
      
      // Confirm mock payment immediately
      if (res.transactionId) {
        await apiClient.fetch('/api/payment/confirm', {
          method: 'POST',
          body: JSON.stringify({ transactionId: res.transactionId })
        });
        toast.success(`Tabriklaymiz! Siz ${plan} tarifiga o'tdingiz.`);
        window.location.reload();
      }
    } catch (error: any) {
      toast.error(error.message || "Xatolik yuz berdi");
    } finally {
      setLoadingPlan(null);
    }
  };

  const currentPlan = user?.plan || 'free';

  const PLAN_DATA = [
    {
      id: 'free',
      name: 'Free',
      bgType: 'bg',
      price: '0 so\'m',
      period: 'doimiy',
      desc: 'Bazaviy yordam uchun ideal',
      features: [
        'Bazaviy maqolalarni ko\'rish',
        'Oxirgi 10 marta ko\'rilganlar tarixi',
        'Tarmoqdagi yordam forumi'
      ],
      disabledFeatures: [
        'Cheksiz qo\'llanmalar',
        'Video yo\'riqnomalar',
        'AI maslahatchidan to\'la qonli tavsiya',
        'Texnik bilan to\'g\'ridan-to\'g\'ri bog\'lanish',
        'Tarixni CSV da eksport qilish'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      bgType: 'accent',
      badge: 'Eng mashhur',
      price: '25,000 so\'m',
      period: 'oyiga',
      desc: 'Barcha qo\'llanmalar va AI tahlil',
      features: [
        'Barcha maqolalar va muammolar',
        'Video yo\'riqnomalarni to\'liq ko\'rish',
        'AI maslahatchidan to\'la qonli tavsiya',
        'Tarixni CSV da eksport qilish',
        'Cheksiz ko\'rish tarixi'
      ],
      disabledFeatures: [
        'Texnik bilan to\'g\'ridan-to\'g\'ri bog\'lanish'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      bgType: 'border',
      price: '50,000 so\'m',
      period: 'konsultatsiya uchun',
      desc: 'Ekspert bilan birga',
      features: [
        'Premium ning barcha imkoniyatlari',
        'Texnik bilan to\'g\'ridan-to\'g\'ri bog\'lanish',
        'Muammoni online diagnostika qilish',
        'Batafsil shaxsiy yo\'riqnoma'
      ],
      disabledFeatures: []
    }
  ];

  return (
    <div className="max-w-[1000px] w-full mx-auto space-y-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">O'zingizga mos tarifni tanlang</h1>
        <p className="text-lg text-[color:var(--text-muted)]">Muammoingizni hal qilish uchun hamyonbop va qulay echimlar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLAN_DATA.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          
          let cardStyle = "card-custom relative flex flex-col h-full bg-[color:var(--bg-card)] border-[color:var(--border)]";
          let btnStyle = "btn-custom w-full border-[color:var(--border)] bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] hover:bg-[color:var(--bg-card)] mt-auto";
          
          if (plan.id === 'premium') {
             cardStyle = "card-custom relative flex flex-col h-full bg-[color:var(--bg-card)] border-2 border-[color:var(--accent)] transform md:-translate-y-4 shadow-xl shadow-[color:var(--accent)]/10";
             btnStyle = "btn-custom w-full bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] text-white mt-auto";
          }

          return (
            <Card key={plan.id} className={cardStyle}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[color:var(--accent)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {plan.badge}
                </div>
              )}
              
              <div className="p-6 border-b border-[color:var(--border)]">
                <h3 className="text-xl font-bold text-[color:var(--text-primary)] mb-2">{plan.name}</h3>
                <p className="text-sm text-[color:var(--text-muted)] min-h-[40px]">{plan.desc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-[color:var(--text-muted)]">/{plan.period}</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((opt, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <Check className="w-5 h-5 text-[color:var(--success)] shrink-0" />
                      <span className="text-[color:var(--text-primary)]">{opt}</span>
                    </li>
                  ))}
                  {plan.disabledFeatures.map((opt, i) => (
                    <li key={'dis'+i} className="flex gap-3 text-sm opacity-40">
                      <div className="w-5 h-5 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-[color:var(--text-muted)]"></div>
                      </div>
                      <span className="text-[color:var(--text-secondary)] line-through">{opt}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loadingPlan === plan.id || isCurrent || (plan.id === 'free' && currentPlan !== 'free')}
                  className={btnStyle}
                >
                  {loadingPlan === plan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                   isCurrent ? 'Sizning tarifingiz' : 
                   plan.id === 'free' ? 'Bepul tarif' : `Ulanish`}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-16 bg-[color:var(--bg-secondary)] border border-[color:var(--border)] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-12 h-12 rounded-full bg-[rgba(124,109,250,0.1)] flex items-center justify-center text-[color:var(--accent)] shrink-0">
          <Info className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2">Mukammal shifrlangan va xavfsiz</h4>
          <p className="text-[color:var(--text-secondary)] leading-relaxed">
            Sizning to'lovlaringiz mutlaqo xavfsiz. Barcha tranzaktsiyalar shifrlangan tarmoqlar (Click, Payme, Uzcard) orqali yuboriladi va ma'lumotlaringiz saqlanmaydi.
          </p>
        </div>
      </div>
    </div>
  );
}
