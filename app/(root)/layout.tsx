'use client';

import React from 'react';

import Bar from '@/components/bar/Index';

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className='flex h-screen w-full font-inter'>
      <div className='flex size-full flex-col'>
        <div className='main-container'>
          <Bar />
          {children}
        </div>
      </div>
    </main>
  );
};

export default RootLayout;
