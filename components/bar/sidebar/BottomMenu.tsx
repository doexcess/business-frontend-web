'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { HiLogout } from 'react-icons/hi';
import { ThemeToggle } from '@/components/theme-toggle';

const BottomMenu = ({ handleClose }: { handleClose?: () => void }) => {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    router.push(route);
    if (typeof handleClose === 'function') handleClose();
  };

  return (
    <div className='w-full mt-auto px-4 py-4'>
      <p className='text-xs uppercase'>Preferences</p>
      <div className='flex flex-col gap-3 mt-2'>
        <ThemeToggle />
        <button
          onClick={() => handleNavigation('/logout')}
          className='w-full flex items-center gap-3 text-sm text-red-600 dark:text-red-200 hover:bg-red-50 hover:dark:bg-gray-700 rounded-lg px-3 py-2 transition'
        >
          <HiLogout className='text-lg' />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
};

export default BottomMenu;
