import React, { useState } from 'react';
import { Dropdown, Avatar } from 'flowbite-react';

const Profile = ({
  isOpen,
  setIsOpen,
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
}) => {
  const handleToggle = () =>
    setIsOpen({ profileDialog: !isOpen.profileDialog, appsDialog: false });
  return (
    <div>
      <button
        type='button'
        onClick={handleToggle}
        className='relative flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600'
        id='user-menu-button'
      >
        <span className='sr-only'>Open user menu</span>
        <img
          className='w-8 h-8 rounded-full'
          src='/icons/profile.png'
          alt='user photo'
        />
      </button>
      {isOpen.profileDialog && (
        <div
          className='absolute z-50 my-4 w-56 text-base list-none bg-white divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 rounded-xl right-3'
          id='dropdown'
        >
          <div className='py-3 px-4'>
            <span className='block text-sm font-semibold text-gray-900 dark:text-white'>
              Neil Sims
            </span>
            <span className='block text-sm text-gray-900 truncate dark:text-white'>
              name@flowbite.com
            </span>
          </div>
          {/* <ul
            className='py-1 text-gray-700 dark:text-gray-300'
            aria-labelledby='dropdown'
          >
            <li>
              <a
                href='#'
                className='block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white'
              >
                My profile
              </a>
            </li>
            <li>
              <a
                href='#'
                className='block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white'
              >
                Account settings
              </a>
            </li>
          </ul> */}

          <ul
            className='py-1 text-gray-700 dark:text-gray-300'
            aria-labelledby='dropdown'
          >
            <li>
              <a
                href='#'
                className='block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
              >
                Sign out
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Profile;
