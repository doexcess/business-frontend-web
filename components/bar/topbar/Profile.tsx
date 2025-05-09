'use client';

import React, { useEffect, useRef, useState } from 'react';
import useProfile from '@/hooks/page/useProfile';
import { cn } from '@/lib/utils';
import ActionConfirmationModal from '@/components/ActionConfirmationModal';
import { useRouter } from 'next/navigation';
import { socketService } from '@/lib/services/socketService';
import { useSocket } from '@/context/SocketProvider';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { userOnline } from '@/redux/slices/chatSlice';
import Icon from '@/components/ui/Icon';
import Link from 'next/link';

const Profile = ({
  isOpen,
  setIsOpen,
  handleClose,
}: {
  isOpen: {
    profileDialog: boolean;
    appsDialog: boolean;
  };
  setIsOpen: React.Dispatch<
    React.SetStateAction<{
      profileDialog: boolean;
      appsDialog: boolean;
    }>
  >;
  handleClose?: () => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const { profile } = useProfile();
  const [logoutOpenModal, setLogoutOpenModal] = useState(false);
  const [allowAction, setAllowAction] = useState(false);
  const { isConnected } = useSocket();

  const handleToggle = () =>
    setIsOpen({ profileDialog: !isOpen.profileDialog, appsDialog: false });

  const handleLogoutNavigation = () => {
    router.push('/logout');
    if (typeof handleClose === 'function') handleClose();
  };

  useEffect(() => {
    if (!isConnected) return;

    const fetchData = async () => {
      if (allowAction) {
        handleLogoutNavigation();
        setAllowAction(false);
      }
    };

    fetchData();
  }, [allowAction, isConnected]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen((prev) => ({ ...prev, profileDialog: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <button
        type='button'
        onClick={handleToggle}
        className='relative flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600'
        id='user-menu-button'
      >
        <span className='sr-only'>Open user menu</span>
        <Icon
          className='w-8 h-8 rounded-full'
          url={
            (profile?.profile && profile?.profile?.profile_picture) ||
            '/icons/icon.png'
          }
        />
      </button>
      {isOpen.profileDialog && (
        <div
          ref={dropdownRef}
          className='absolute z-50 my-4 w-56 text-base list-none bg-white divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 rounded-xl right-3'
          id='dropdown'
        >
          <div className='py-3 px-4'>
            <span className='block text-sm font-semibold text-gray-900 dark:text-white'>
              {profile?.name}
            </span>
            <span className='block text-sm text-gray-900 truncate dark:text-white'>
              {profile?.email}
            </span>
          </div>
          <ul
            className='py-1 text-gray-700 dark:text-gray-300'
            aria-labelledby='dropdown'
          >
            <li>
              <Link
                href='/settings'
                className='block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-300 dark:hover:text-white'
              >
                Settings
              </Link>
            </li>
            <li>
              <a
                href='/help'
                className='block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-300 dark:hover:text-white'
              >
                Help
              </a>
            </li>
          </ul>

          <ul
            className='py-1 text-gray-700 dark:text-gray-300'
            aria-labelledby='dropdown'
          >
            <li>
              <button
                onClick={() => setLogoutOpenModal(true)}
                className='block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left'
              >
                Sign out
              </button>
              <ActionConfirmationModal
                openModal={logoutOpenModal}
                setOpenModal={setLogoutOpenModal}
                allowAction={allowAction}
                setAllowAction={setAllowAction}
              />
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Profile;
