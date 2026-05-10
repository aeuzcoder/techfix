'use client';

import React, { useState } from 'react';
import { Cpu, Monitor, MemoryStick, HardDrive, Tv, Wallet, ExternalLink } from 'lucide-react';
import { PremiumGate } from '@/components/shared/PremiumGate';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface AdvisorResultProps {
  data: any;
  onReset: () => void;
}

export function AdvisorResult({ data, onReset }: AdvisorResultProps) {
  const { user } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<'olx' | 'uzum' | 'texnomart'>('olx');

  // Dummy logic for testing/mock
  const MOCK_PRODUCTS = [
    { id: 1, title: 'MacBook Air M1 8/256GB', price: '9 500 000 so\'m', condition: 'Yangi', source: 'OLX', link: '#' },
    { id: 2, title: 'HP Victus 15 Ryzen 5 RTX 3050', price: '8 800 000 so\'m', condition: 'Ishlatilgan', source: 'OLX', link: '#' },
    { id: 3, title: 'Lenovo IdeaPad 3 Core i5 12th', price: '7 200 000 so\'m', condition: 'Yangi', source: 'OLX', link: '#' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-5xl mx-auto w-full">
      {/* Left Column (40%) */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="card-custom bg-[color:var(--bg-card)] border-[color:var(--border)]">
          <h3 className="text-xl font-bold mb-6">Tavsiya etilgan xarakteristika</h3>
          
          <div className="space-y-4">
            <SpecRow icon={Cpu} label="Protsessor" value={data.cpu} />
            <SpecRow icon={Monitor} label="Video karta" value={data.gpu} />
            <SpecRow icon={MemoryStick} label="Tezkor xotira (RAM)" value={`${data.ram} GB`} />
            <SpecRow icon={HardDrive} label="Xotira (SSD/HDD)" value={`${data.ssd} GB`} />
            <SpecRow icon={Tv} label="Ekran" value={data.display} />
            <SpecRow 
              icon={Wallet} 
              label="Taxminiy Byudjet" 
              value={`${(data.budget_min/1000000).toFixed(1)}M - ${(data.budget_max/1000000).toFixed(1)}M so'm`} 
            />
          </div>

          <p className="text-sm text-[color:var(--text-muted)] mt-6 bg-[color:var(--bg-secondary)] p-4 rounded-lg leading-relaxed">
            {data.justification}
          </p>

          <button 
            onClick={onReset}
            className="w-full mt-6 btn-custom bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] border border-[color:var(--border)] hover:bg-[color:var(--bg-card)]"
          >
            Boshidan boshlash
          </button>
        </div>
      </div>

      {/* Right Column (60%) */}
      <div className="lg:col-span-3">
        <div className="card-custom bg-[color:var(--bg-card)] border-[color:var(--border)] h-full flex flex-col">
          <h3 className="text-xl font-bold mb-4">Mos qurilmalar</h3>
          
          <div className="flex gap-2 border-b border-[color:var(--border)] mb-4">
            {(['olx', 'uzum', 'texnomart'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px capitalize ${
                  activeTab === tab 
                    ? 'border-[color:var(--accent)] text-[color:var(--accent)]' 
                    : 'border-transparent text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            <PremiumGate requiredPlan="premium" userPlan={user?.plan as any}>
              {activeTab === 'olx' ? (
                <div className="space-y-3">
                  {MOCK_PRODUCTS.map(p => (
                    <div key={p.id} className="flex gap-4 p-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-secondary)] items-center">
                      <div className="w-12 h-12 bg-[#0e0e11] rounded-lg shrink-0 flex items-center justify-center border border-[color:var(--border)]">
                        <Monitor className="w-5 h-5 text-[color:var(--text-muted)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-[color:var(--text-primary)] truncate">{p.title}</h4>
                        <div className="flex gap-2 mt-1">
                          <span className="badge-custom bg-[color:var(--accent)] text-white">{p.price}</span>
                          <span className="badge-custom bg-[color:var(--bg-card)] text-[color:var(--text-secondary)] border border-[color:var(--border)]">{p.condition}</span>
                        </div>
                      </div>
                      <a href={p.link} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[color:var(--bg-card)] flex items-center justify-center text-[color:var(--text-secondary)] hover:text-[color:var(--accent)] shrink-0 border border-[color:var(--border)]">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {/* TODO: Replace with real OLX/Uzum/Texnomart API calls */}
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="text-[color:var(--text-muted)] italic">
                      Bu yerda {activeTab} do'konidan mos natijalar ko'rsatiladi (Hozircha test rejimida)
                    </div>
                  </div>
                </div>
              )}
            </PremiumGate>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecRow({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) {
  return (
    <div className="flex items-center justify-between pb-3 border-b border-[color:var(--border)] last:border-0 last:pb-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[color:var(--bg-secondary)] flex items-center justify-center text-[color:var(--text-secondary)]">
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium text-[color:var(--text-secondary)]">{label}</span>
      </div>
      <span className="text-sm font-semibold text-[color:var(--text-primary)] text-right pl-4">{value}</span>
    </div>
  );
}
