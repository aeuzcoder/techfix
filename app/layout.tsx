import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/shared/AuthProvider';
import './globals.css';

const inter = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TechFix - Kompyuter muammolarini yechish',
  description: 'Kompyuter va noutbuklarda yuzaga keladigan muammolarni aniqlash va hal qilish bo\'yicha qo\'llanmalar.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${robotoMono.variable} font-sans`} suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster 
          position="top-center" 
          toastOptions={{ 
            style: { 
              background: 'var(--bg-card)', 
              color: 'var(--text-primary)', 
              border: '1px solid var(--border)' 
            } 
          }} 
        />
      </body>
    </html>
  );
}
