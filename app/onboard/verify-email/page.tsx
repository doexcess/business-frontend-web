'use client';

import ResendEmail from '@/components/auth/ResendEmail';
import VerifyEmailForm from '@/components/auth/VerifyEmailForm';
import { decryptInput, emailSplit, maskSensitiveData } from '@/lib/utils';
import Head from 'next/head';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';

const VerifyEmail = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
};

const VerifyEmailContent = () => {
  const params = useSearchParams();

  const decyptedData = decryptInput(params.get('token')!);

  const splitEmail = emailSplit(decyptedData);

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
            A 6-Digit code has been sent to {maskSensitiveData(splitEmail[0])}@
            {splitEmail[1]}. Enter code.
          </p>

          <VerifyEmailForm />

          <div className='flex flex-wrap justify-center gap-1 sm:gap-2 mt-6 sm:mt-8 mb-4 text-sm sm:text-base'>
            <p>Didn't receive any code?</p>
            <ResendEmail />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
