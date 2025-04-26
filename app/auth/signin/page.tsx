'use client';

import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

const Signin = () => {
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
        <title>Signin</title>
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
            Welcome!
          </h1>

          <p className='text-sm sm:text-base text-gray-600 text-center mb-6 max-w-md'>
            Log in to explore courses, events and the businesses you've
            subscribed to.
          </p>

          <div className='w-full space-y-4 mb-6 sm:mb-8'>
            <form className='space-y-4'>
              <div>
                <label
                  htmlFor='email'
                  className='block mb-2 text-sm font-bold text-gray-900'
                >
                  Email address
                </label>
                <Input
                  type='text'
                  name='email'
                  placeholder='Enter your business email address'
                  className='w-full rounded-lg text-gray-900'
                  value={''}
                  required={true}
                  enableDarkMode={false}
                />
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='block mb-2 text-sm font-bold text-gray-900'
                >
                  Password
                </label>
                <Input
                  type='password'
                  name='password'
                  placeholder='Enter your password'
                  className='w-full rounded-lg text-gray-900'
                  value={''}
                  required={true}
                  enableDarkMode={false}
                />
              </div>

              <div className='flex justify-end'>
                <Link href='' className='text-primary-main font-bold'>
                  Forgot Password?
                </Link>
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
            Sign in
          </button>

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
            <span className='text-sm sm:text-base'>Sign in with Google</span>
          </Button>

          <div className='flex flex-wrap justify-center gap-1 sm:gap-2 mt-6 sm:mt-8 mb-4 text-sm sm:text-base'>
            <p>Don't have an account?</p>
            <Link href='' className='text-primary-main font-bold'>
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
