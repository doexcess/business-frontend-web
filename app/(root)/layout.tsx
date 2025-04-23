import React from 'react';

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className='flex h-screen w-full font-inter'>
      <div className='flex size-full flex-col'>
        <div className='main-container'>{children}</div>
      </div>
    </main>
  );
};

export default RootLayout;
