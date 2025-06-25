'use client';

import React, { useEffect } from 'react';

import Bar from '@/components/bar/Index';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { SocketProvider } from '@/context/SocketProvider';

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error, token } = useSelector(
    (state: RootState) => state.auth
  );

  // Log auth state for debugging
  useEffect(() => {
    console.log('RootLayout: Auth state changed', {
      hasToken: !!token,
      tokenLength: token?.length,
      hasUser: !!user,
      loading,
    });
  }, [token, user, loading]);

  if (!token) {
    console.log('RootLayout: No token, redirecting to signin');
    return router.push('/auth/signin');
  }

  console.log('RootLayout: Rendering with token, setting up SocketProvider');

  return (
    <SocketProvider>
      <main className='flex h-screen w-full font-gilroy bg-white dark:bg-gray-900'>
        <div className='flex size-full flex-col'>
          <div className='main-container'>
            <Bar />
            {children}
          </div>
        </div>
      </main>
    </SocketProvider>
  );
};

export default RootLayout;
