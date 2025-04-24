'use client';

import React, { useState } from 'react';
import Apps from './Apps';
import Profile from './Profile';
import Link from 'next/link';
import MobileNav from '../sidebar/MobileNav';
import Logo from '@/components/ui/Logo';
import RecentNotifications from './RecentNotifications';
import Search from './Search';

const Topbar = () => {
  const [isOpen, setIsOpen] = useState({
    profileDialog: false,
    appsDialog: false,
  });

  return (
    <nav className='md:ml-60 px-4 py-2.5 z-50 bg-neutral-2 dark:bg-gray-800 shadow-light'>
      <div className='flex flex-wrap justify-between items-center'>
        <div className='flex justify-start items-center'>
          <Search />
          {/* Mobile nav */}
          <MobileNav />
        </div>
        <div className='flex items-center lg:order-2 gap-1'>
          <RecentNotifications />

          {/* Apps */}
          {/* <Apps isOpen={isOpen} setIsOpen={setIsOpen} /> */}

          {/* Profile */}
          <Profile isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>
      {/* Drawer for mobile view */}
    </nav>
  );
};

export default Topbar;
