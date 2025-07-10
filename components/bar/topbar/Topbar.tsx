'use client';

import React, { useState } from 'react';
import Profile from './Profile';
import Link from 'next/link';
import MobileNav from '../sidebar/MobileNav';
import RecentNotifications from './RecentNotifications';
import Search from './Search';
import Icon from '@/components/ui/Icon';
import useCart from '@/hooks/page/useCart';
import { ShoppingCart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { SystemRole } from '@/lib/utils';

const Topbar = () => {
  const { count } = useCart();
  const { profile } = useSelector((state: RootState) => state.auth);

  const [isOpen, setIsOpen] = useState({
    profileDialog: false,
    appsDialog: false,
  });

  return (
    <nav className='md:ml-60 px-4 py-2.5 z-50 bg-neutral-2 dark:bg-gray-800 shadow-light'>
      <div className='flex flex-wrap justify-between items-center'>
        <div className='flex justify-start items-center'>
          <Link
            href=''
            className='flex items-center justify-between mr-4 md:hidden'
          >
            <Icon
              url='/icons/icon-white.png'
              width={30}
              height={30}
              className='rounded-lg hidden dark:block'
            />
            <Icon
              url='/icons/icon.png'
              width={30}
              height={30}
              className='rounded-lg block dark:hidden'
            />
          </Link>
          <Search />
          {/* Mobile nav */}
          <MobileNav />
        </div>
        <div className='flex items-center lg:order-2 gap-1'>
          <RecentNotifications />

          {/* Cart Icon with Badge */}
          {profile?.role.role_id === SystemRole.USER && (
            <Link
              href='/dashboard/cart'
              className='relative flex items-center mx-2'
            >
              <ShoppingCart
                size={24}
                className='text-gray-700 dark:text-gray-200'
              />
              {count > 0 && (
                <span className='absolute -top-2 -right-2 bg-primary-main text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center'>
                  {count}
                </span>
              )}
            </Link>
          )}

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
