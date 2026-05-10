'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

const QUESTIONS = [
  {
    title: "Asosiy maqsad nima?",
    options: ["O'yin o'ynash", "Ish va ofis", "O'qish", "Video montaj", "Oddiy ishlatish"],
  },
  {
    title: "Qanday o'yinlar o'ynaysiz?",
    options: ["AAA (yangi) o'yinlar", "Oddiy, yengil o'yinlar", "O'yin o'ynamayman"],
  },
  {
    title: "Dasturlash qilasizmi?",
    options: ["Ha, og'ir (AI/ML, server)", "Ha, oddiy web/mobile", "Yo'q"],
  },
  {
    title: "Video yoki foto ishlaysizmi?",
    options: ["Ha, 4K montaj", "Ha, oddiy montaj", "Yo'q"],
  },
  {
    title: "Batareya qancha muhim?",
    options: ["Juda muhim, 8+ soat kerak", "O'rtacha", "Muhim emas, rozetka yaqin"],
  },
  {
    title: "Noutbukni ko'p ko'taryapsizmi?",
    options: ["Ha, yengil bo'lsin (1.5kg dan kam)", "Ba'zan", "Yo'q, bir joyda turadi"],
  },
  {
    title: "Ekran o'lchami qanday bo'lsin?",
    options: ["13-14 dyuym (kichik)", "15-16 dyuym (o'rta)", "17+ dyuym (katta)"],
  },
  {
    title: "Byudjetingiz qancha?",
    options: ["3-5 million so'm", "5-8 million so'm", "8-15 million so'm", "15 million+ so'm"],
  },
  {
    title: "Yangi yoki ishlatilgan bo'lsa ham bo'ladimi?",
    options: ["Faqat yangi", "Ishlatilgan ham yaxshi", "Farqi yo'q"],
  },
  {
    title: "Eng muhim narsa nima?",
    options: ["Tez SSD (tizim tezligi)", "Ko'p RAM (ko'p dastur)", "Ikkalasi bir xil muhim"],
  }
];

interface QuestionWizardProps {
  currentStep: number;
  answers: string[];
  onAnswer: (answer: string) => void;
  onAnalyze: () => void;
}

export function QuestionWizard({ currentStep, answers, onAnswer, onAnalyze }: QuestionWizardProps) {
  const qIndex = currentStep - 1;
  const question = QUESTIONS[qIndex];
  const progressPercent = (currentStep / 10) * 100;

  return (
    <div className="max-w-[600px] mx-auto w-full">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2 text-sm">
          <span className="text-[color:var(--text-secondary)] font-medium">Jarayon</span>
          <span className="text-[color:var(--text-muted)]">{currentStep}/10</span>
        </div>
        <div className="w-full bg-[color:var(--bg-secondary)] h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[color:var(--accent)] transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="card-custom bg-[color:var(--bg-card)] border border-[color:var(--border)] p-8">
        <h2 className="text-2xl font-bold mb-6 text-[color:var(--text-primary)] text-center">
          {question.title}
        </h2>
        
        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = answers[qIndex] === option;
            return (
              <button
                key={option}
                onClick={() => onAnswer(option)}
                className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-200 ${
                  isSelected 
                    ? 'border-[color:var(--accent)] bg-[rgba(124,109,250,0.08)] text-[color:var(--text-primary)] font-medium' 
                    : 'border-[color:var(--border)] bg-[color:var(--bg-secondary)] text-[color:var(--text-secondary)] hover:border-[color:var(--border-hover)] hover:text-[color:var(--text-primary)]'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {currentStep === 10 && answers[9] && (
          <div className="mt-8">
            <Button 
              onClick={onAnalyze}
              className="w-full btn-custom bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] text-white text-base py-6"
            >
              Tahlil qilish &rarr;
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
