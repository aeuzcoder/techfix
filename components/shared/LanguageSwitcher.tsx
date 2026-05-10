'use client';

import React from 'react';
import { useUiStore } from '@/store/ui.store';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const flags = {
  uz: '🇺🇿 UZ',
  ru: '🇷🇺 RU',
  en: '🇬🇧 EN'
};

export function LanguageSwitcher() {
  const { language, setLanguage } = useUiStore();
  const { isAuthenticated } = useCurrentUser();

  const handleLanguageChange = async (lang: 'uz' | 'ru' | 'en') => {
    setLanguage(lang);
    if (isAuthenticated) {
      try {
        await apiClient.fetch('/api/auth/me', {
          method: 'PUT',
          body: JSON.stringify({ language: lang })
        });
      } catch (e) {
        console.error('Failed to save language preference', e);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-[36px] bg-[color:var(--bg-secondary)] border-[color:var(--border)] hover:bg-[color:var(--bg-card)]">
          {flags[language]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[color:var(--bg-card)] border-[color:var(--border)]">
        {(Object.keys(flags) as Array<keyof typeof flags>).map((lang) => (
          <DropdownMenuItem 
            key={lang} 
            onClick={() => handleLanguageChange(lang)}
            className="cursor-pointer hover:bg-[color:var(--bg-secondary)] focus:bg-[color:var(--bg-secondary)]"
          >
            {flags[lang]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
