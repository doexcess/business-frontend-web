import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/providers/toaster-provider';
import { ConfettiProvider } from '@/components/providers/confetti-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

import ReduxProvider from '@/redux/redux-provider';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'Doexcess Business',
  description: 'Streamline and automate essential processes.',
  icons: {
    icon: '/icons/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      <html lang='en'>
        <ConfettiProvider />
        <ToastProvider />
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <body className={`${inter.className} `}>{children}</body>
        </ThemeProvider>
      </html>
    </ReduxProvider>
  );
}
