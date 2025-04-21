'use client';

import { Button } from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Input from '@/components/ui/Input';
import OTPInput from '@/components/ui/OtpInput';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

const defaultValue = {
  otp: '',
};

const VerifyEmail = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const [body, setBody] = useState(defaultValue);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      console.log(`Selected role: ${selectedRole}`);
    }
  };

  const handleOTPComplete = (otp: string) => {
    setBody({ ...body, otp });
  };

  return (
    <div className='min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-light text-black-1'>
      <Head>
        <title>Verify Email</title>
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
            Verify Mail
          </h1>

          <p className='text-sm sm:text-base text-gray-600 text-center mb-6 max-w-md'>
            A 6-Digit code has been sent to john***@mxtechsolutions.com. Enter
            code.
          </p>

          <div className='space-y-4 mb-6 sm:mb-8'>
            <form className='space-y-4'>
              <div className='flex mt-5 mb-8'>
                <OTPInput
                  onComplete={handleOTPComplete}
                  allowDarkMode={false}
                  className='w-[50px] h-[50px]'
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

          <div className='flex flex-wrap justify-center gap-1 sm:gap-2 mt-6 sm:mt-8 mb-4 text-sm sm:text-base'>
            <p>Didn't receive any code?</p>
            <Link href='' className='text-primary-main font-bold'>
              Resend
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
