'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { QuestionWizard } from '@/components/advisor/QuestionWizard';
import { AdvisorResult } from '@/components/advisor/AdvisorResult';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

export default function AdvisorPage() {
  const [status, setStatus] = useState<'wizard' | 'loading' | 'results'>('wizard');
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<string[]>(Array(10).fill(''));
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep - 1] = answer;
    setAnswers(newAnswers);

    if (currentStep < 10) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300);
    }
  };

  const handleAnalyze = async () => {
    try {
      setStatus('loading');
      const data = await apiClient.fetch('/api/advisor/analyze', {
        method: 'POST',
        body: JSON.stringify({ answers })
      });
      setAnalysisResult(data);
      setStatus('results');
    } catch (error: any) {
      toast.error('Tahlil qilishda xatolik yuz berdi: ' + error.message);
      setStatus('wizard');
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setAnswers(Array(10).fill(''));
    setAnalysisResult(null);
    setStatus('wizard');
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center py-8">
      {status === 'loading' && (
        <div className="card-custom max-w-sm w-full bg-[color:var(--bg-card)] border-[color:var(--border)] text-center py-12 flex flex-col items-center">
          <Loader2 className="w-10 h-10 animate-spin text-[color:var(--accent)] mb-4" />
          <h3 className="text-lg font-bold text-[color:var(--text-primary)] mb-2">AI tahlil qilyapti...</h3>
          <p className="text-[color:var(--text-muted)] text-sm">Bu bir necha soniya oladi</p>
        </div>
      )}

      {status === 'wizard' && (
        <QuestionWizard 
          currentStep={currentStep} 
          answers={answers} 
          onAnswer={handleAnswer} 
          onAnalyze={handleAnalyze} 
        />
      )}

      {status === 'results' && analysisResult && (
        <AdvisorResult data={analysisResult} onReset={handleReset} />
      )}
    </div>
  );
}
