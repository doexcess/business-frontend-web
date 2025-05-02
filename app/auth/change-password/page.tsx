'use client';

import ChangePasswordForm from '@/components/auth/ChangePasswordForm';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useVerifyToken } from '@/hooks/useVerifyToken';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

const ChangePassword = () => {
  const params = useSearchParams();

  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const { userDetails, setUserDetails, token } = useVerifyToken(
    params.get('token')!
  );

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

          <ChangePasswordForm token={token} />
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
