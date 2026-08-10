import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Providers from './providers';
import ScrollProgress from '@/app/components/ui/ScrollProgress';
import { CurrencyProvider } from '@/app/context/CurrencyContext';
import { ChatbotProvider } from '@/app/context/ChatbotContext';
import Chatbot from '@/app/components/Chatbot';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TravelHub - Your Gateway to Amazing Adventures',
  description:
    "Discover unforgettable travel experiences with curated tours to the world's most amazing destinations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={inter.className}>
        <CurrencyProvider>
          <Providers>
            {/* ✅ ChatbotProvider wraps components that need chatbot state */}
            <ChatbotProvider>
              <ScrollProgress />
              <Header />
              <main>{children}</main>
              <Footer />
              <Chatbot />
            </ChatbotProvider>
          </Providers>
        </CurrencyProvider>
      </body>
    </html>
  );
}