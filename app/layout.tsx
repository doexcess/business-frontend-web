import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/providers/toaster-provider';
import { ConfettiProvider } from '@/components/providers/confetti-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

import ReduxProvider from '@/redux/redux-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';

export const metadata: Metadata = {
  title: 'Doexcess',
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
        <head>
          <link rel='icon' href='/icons/icon.png' />
          <meta property='og:image' content='/icons/icon.png' />
          <meta name='twitter:image' content='/icons/icon.png' />
          <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Doexcess',
                url: 'https://doexcess.com',
                logo: 'https://doexcess.com/icons/icon.png',
                sameAs: [
                  'https://twitter.com/doexcess',
                  'https://www.linkedin.com/company/doexcess',
                ],
              }),
            }}
          />
        </head>
        <ConfettiProvider />
        <ToastProvider />
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <body className={`font-gilroy bg-white dark:bg-gray-900`}>
            {children}
          </body>
        </ThemeProvider>
      </html>
    </ReduxProvider>
  );
}
