'use client';

import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

const ChangePassword = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      console.log(`Selected role: ${selectedRole}`);
    }
  };

  return (
    <div className='min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-light text-black-1'>
      <Head>
        <title>Change Password</title>
      </Head>

      <div className='w-full max-w-2xl border-2 border-white rounded-2xl bg-primary-light p-4 sm:p-8 md:p-10 my-4 sm:my-8 md:my-12'>
        <div className='w-full rounded-2xl p-6 sm:p-8 bg-white flex flex-col items-center justify-center'>
          <div className='flex items-center justify-center mb-6 sm:mb-8'>
            <Image
              src={'/icons/icon.png'}
              width={60}
              height={60}
              alt='Logo icon'
              className='rounded-lg'
              priority
            />
          </div>

          <h1 className='text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2'>
            Change Password
          </h1>

          <p className='text-sm sm:text-base text-gray-600 text-center mb-6 max-w-md'>
            Ensure your new password is different from the old password
          </p>

          <div className='w-full space-y-4 mb-6 sm:mb-8'>
            <form className='space-y-4'>
              <div>
                <label
                  htmlFor='password'
                  className='block mb-2 text-sm font-bold text-gray-900'
                >
                  Create new password
                </label>
                <Input
                  type='password'
                  name='password'
                  placeholder='Create a password'
                  className='w-full rounded-lg text-gray-900'
                  value={''}
                  required={true}
                  enableDarkMode={false}
                />
                <div className='text-neutral mt-2 text-xs sm:text-sm'>
                  <div className='flex flex-wrap gap-x-4 gap-y-1'>
                    <p className='flex gap-1'>
                      <Image
                        src='/icons/auth/check.svg'
                        width='20'
                        height='20'
                        objectFit='contain'
                        alt='check-icon'
                      />
                      Must be at least 8 characters
                    </p>
                    <p className='flex gap-1'>
                      <Image
                        src='/icons/auth/check.svg'
                        width='20'
                        height='20'
                        objectFit='contain'
                        alt='check-icon'
                      />
                      Lower case
                    </p>
                    <p className='flex gap-1'>
                      <Image
                        src='/icons/auth/check.svg'
                        width='20'
                        height='20'
                        objectFit='contain'
                        alt='check-icon'
                      />
                      Upper case
                    </p>
                    <p className='flex gap-1'>
                      <Image
                        src='/icons/auth/check.svg'
                        width='20'
                        height='20'
                        objectFit='contain'
                        alt='check-icon'
                      />
                      One special character
                    </p>
                    <p className='flex gap-1'>
                      <Image
                        src='/icons/auth/check.svg'
                        width='20'
                        height='20'
                        objectFit='contain'
                        alt='check-icon'
                      />
                      Digit
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor='retype-password'
                  className='block mb-2 text-sm font-bold text-gray-900'
                >
                  Retype Password
                </label>
                <Input
                  type='password'
                  name='retype-password'
                  placeholder='Retype your password'
                  className='w-full rounded-lg text-gray-900'
                  value={''}
                  required={true}
                  enableDarkMode={false}
                />
              </div>
            </form>
          </div>

          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
              selectedRole
                ? 'bg-primary-main hover:bg-primary-800'
                : 'bg-primary-faded cursor-not-allowed'
            }`}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
