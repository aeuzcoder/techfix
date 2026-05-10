'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, AlertTriangle, Lightbulb, Play, ListChecks } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/lib/api-client';
import { useUiStore } from '@/store/ui.store';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { ProblemFeedback } from '@/components/problems/ProblemFeedback';

export default function ProblemDetailPage({ params }: { params: { slug: string } }) {
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useUiStore();
  const { isAuthenticated } = useCurrentUser();

  useEffect(() => {
    // Fetch problem details
    apiClient.fetch(`/api/problems/${params.slug}`)
      .then((data) => {
        setProblem(data);
        setLoading(false);
        // Silently record history if authenticated
        if (isAuthenticated && data?._id) {
          apiClient.fetch('/api/history', {
            method: 'POST',
            body: JSON.stringify({ problemId: data._id }),
          }).catch(console.error);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, [params.slug, isAuthenticated]);

  if (loading) {
    return (
      <div className="max-w-[760px] mx-auto w-full space-y-6">
        <Skeleton className="h-6 w-1/3 bg-[color:var(--bg-secondary)]" />
        <Skeleton className="h-12 w-3/4 bg-[color:var(--bg-secondary)]" />
        <Skeleton className="h-[400px] w-full rounded-xl bg-[color:var(--bg-secondary)]" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Muammo topilmadi</h2>
        <p className="text-[color:var(--text-muted)] mb-6">Bunday linkdagi maqola mavjud emas yoki o'chirilgan.</p>
        <Link href="/dashboard" className="btn-custom bg-[color:var(--accent)] text-white px-6">Bosh sahifaga qaytish</Link>
      </div>
    );
  }

  const name = problem.name[language] || problem.name.uz;
  const warning = problem.warning?.[language] || problem.warning?.uz;
  const tip = problem.tip?.[language] || problem.tip?.uz;

  // Extract youtube ID for embed
  let youtubeUrl = '';
  if (problem.videoUrl) {
    try {
      const url = new URL(problem.videoUrl);
      const v = url.searchParams.get('v');
      if (v) youtubeUrl = `https://www.youtube.com/embed/${v}`;
      else if (url.pathname.startsWith('/embed/')) youtubeUrl = problem.videoUrl;
    } catch(e) {}
  }

  return (
    <div className="max-w-[760px] mx-auto w-full space-y-8 pb-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${problem.category}`}>{problem.category}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-[color:var(--text-primary)] font-medium">
              {name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-4 border-b border-[color:var(--border)] pb-8">
        <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="badge-custom bg-[color:var(--bg-secondary)] text-[color:var(--text-secondary)] border border-[color:var(--border)] border-l-2 border-l-[color:var(--accent)]">
            {problem.subcategory}
          </span>
          <div className="flex items-center text-[color:var(--text-muted)] gap-1.5">
            <Eye className="w-4 h-4" />
            <span>{problem.viewCount} marta ko'rilgan</span>
          </div>
          <div className="flex items-center gap-2">
            {problem.tags?.map((tag: string) => (
              <span key={tag} className="badge-custom bg-[color:var(--bg-card)] text-xs text-[color:var(--text-muted)]">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {warning && (
        <div className="bg-[rgba(245,165,36,0.06)] border-l-4 border-[color:var(--warning)] p-4 rounded-r-lg flex gap-3 text-[15px]">
          <AlertTriangle className="w-5 h-5 text-[color:var(--warning)] shrink-0 mt-0.5" />
          <div className="text-[color:var(--text-primary)]">{warning}</div>
        </div>
      )}

      {youtubeUrl && (
        <section className="space-y-4">
          <h3 className="flex items-center gap-2 text-xl font-bold">
            <Play className="w-5 h-5 text-[color:var(--accent)]" />
            Video yo'riqnoma
          </h3>
          <div className="aspect-video w-full rounded-xl overflow-hidden border border-[color:var(--border)] relative bg-[color:var(--bg-secondary)]">
            <iframe 
              src={youtubeUrl} 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </section>
      )}

      <section className="space-y-6">
        <h3 className="flex items-center gap-2 text-xl font-bold border-b border-[color:var(--border)] pb-3">
          <ListChecks className="w-5 h-5 text-[color:var(--accent)]" />
          Ketma-ket qadamlar
        </h3>
        
        <div className="space-y-8">
          {problem.steps?.map((step: any, index: number) => {
            const stepTitle = step.title[language] || step.title.uz;
            const stepDesc = step.description[language] || step.description.uz;
            return (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[color:var(--accent)] text-white flex justify-center items-center font-bold text-sm shrink-0">
                    {step.order || index + 1}
                  </div>
                  {index !== problem.steps.length - 1 && (
                    <div className="w-px h-full bg-[color:var(--border)] mt-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <h4 className="text-lg font-semibold mb-2">{stepTitle}</h4>
                  <p className="text-[color:var(--text-secondary)] whitespace-pre-wrap text-[15px] leading-relaxed mb-4">
                    {stepDesc}
                  </p>
                  {step.imageUrl && (
                    <a href={step.imageUrl} target="_blank" rel="noreferrer" className="block max-w-sm rounded-lg overflow-hidden border border-[color:var(--border)] hover:border-[color:var(--accent)] transition-colors">
                      <img src={step.imageUrl} alt={stepTitle} className="w-full h-auto" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {tip && (
        <div className="bg-[rgba(34,201,122,0.06)] border-l-4 border-[color:var(--success)] p-4 rounded-r-lg flex gap-3 text-[15px]">
          <Lightbulb className="w-5 h-5 text-[color:var(--success)] shrink-0 mt-0.5" />
          <div className="text-[color:var(--text-primary)]">{tip}</div>
        </div>
      )}

      {/* Problem Specific Feedback */}
      <ProblemFeedback problemId={problem._id} />
    </div>
  );
}
