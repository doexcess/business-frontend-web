'use client';

import SigninForm from '@/components/auth/SigninForm';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

const Signin = () => {
  return (
    <div className='min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-light text-black-1'>
      <Head>
        <title>Signin</title>
      </Head>

      <div className='w-full max-w-2xl border-2 border-white rounded-2xl bg-primary-light p-4 sm:p-8 md:p-10 my-4 sm:my-8 md:my-12'>
        <div className='w-full rounded-2xl p-6 sm:p-8 bg-white flex flex-col items-center justify-center'>
          <Link
            href={'/'}
            className='flex items-center justify-center mb-6 sm:mb-8'
          >
            <Image
              src={'/icons/icon.png'}
              width={60}
              height={60}
              alt='Logo icon'
              className='rounded-lg'
              priority
            />
          </Link>

          <h1 className='text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2'>
            Welcome!
          </h1>

          <p className='text-sm sm:text-base text-gray-600 text-center mb-6 max-w-md'>
            Log in to explore courses, events and the businesses you've
            subscribed to.
          </p>

          <SigninForm />

          {/* Google login to be implemented later */}

          <div className='flex flex-wrap justify-center gap-1 sm:gap-2 mt-6 sm:mt-8 mb-4 text-sm sm:text-base'>
            <p>Don't have an account?</p>
            <Link
              href='/onboard/signup'
              className='text-primary-main font-bold'
            >
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
