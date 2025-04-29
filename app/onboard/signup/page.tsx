'use client';

import RegisterForm from '@/components/auth/RegisterForm';
import { Button } from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Input from '@/components/ui/Input';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

const Signup = () => {
  return (
    <div className='min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-light dark:bg-gray-800 text-black-1'>
      <Head>
        <title>Signup</title>
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
            Grow Your Business with Doexcess
          </h1>

          <p className='text-sm sm:text-base text-gray-600 text-center mb-6 max-w-md'>
            Sign up to streamline operations, onboard team members and manage
            your courses and events.
          </p>

          <RegisterForm />

          <div className='relative w-full mt-6 sm:mt-8'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-muted'></div>
            </div>
            <div className='relative flex justify-center'>
              <span className='px-2 bg-white text-sm text-muted-foreground'>
                or
              </span>
            </div>
          </div>

          <Button
            className='mt-6 sm:mt-8 text-primary-main w-full border-primary-main flex gap-2 hover:bg-primary-main hover:text-white'
            variant={'outline'}
          >
            <Image
              src={'/icons/auth/google.svg'}
              alt='google'
              width={20}
              height={20}
              className='object-contain'
            />
            <span className='text-sm sm:text-base'>Sign up with Google</span>
          </Button>

          <div className='flex flex-wrap justify-center gap-1 sm:gap-2 mt-6 sm:mt-8 mb-4 text-sm sm:text-base'>
            <p>Already have an account?</p>
            <Link href='' className='text-primary-main font-bold'>
              Sign in
            </Link>
          </div>

          <div className='flex gap-2 w-full mt-4'>
            <div className='flex-1 bg-primary-main h-0.5 rounded-md'></div>
            <div className='flex-1 bg-slate-400 h-0.5 rounded-md'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
