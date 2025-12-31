import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LIP Packaging - Premium Packaging Solutions',
  description: 'Buy self-lock boxes, corrugated boxes, parcel tapes, and courier covers. Bulk pricing available. Custom branding via WhatsApp.',
  keywords: 'packaging, boxes, parcel tape, courier covers, e-commerce packaging',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

