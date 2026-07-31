import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MedicalProvider } from '@/context/MedicalContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CareLens | AI Health Timeline & Change Detection for Caregivers',
  description:
    'CareLens converts scattered paper prescriptions and medical reports into a continuous AI health timeline with change detection, lab trend analytics, and doctor conflict detection for family caregivers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased`}>
        <MedicalProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <Footer />
        </MedicalProvider>
      </body>
    </html>
  );
}
