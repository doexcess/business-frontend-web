'use client';

import { Button } from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Input from '@/components/ui/Input';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

const Signup = () => {
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

          <div className='w-full space-y-4 mb-6 sm:mb-8'>
            <form className='space-y-4'>
              <div>
                <label
                  htmlFor='business-name'
                  className='block mb-2 text-sm font-bold text-gray-900'
                >
                  Business Name
                </label>
                <Input
                  type='text'
                  name='business-name'
                  placeholder='Enter your company name'
                  className='w-full rounded-lg text-gray-900'
                  value={''}
                  required={true}
                  enableDarkMode={false}
                />
              </div>

              <div>
                <label
                  htmlFor='business-email'
                  className='block mb-2 text-sm font-bold text-gray-900'
                >
                  Business Email
                </label>
                <Input
                  type='text'
                  name='business-email'
                  placeholder='you@yourcompany.com'
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

              <div className='flex items-start'>
                <div className='flex items-center h-5'>
                  <Checkbox
                    type='checkbox'
                    name='remember'
                    className='bg-white rounded-sm'
                  />
                </div>
                <div className='ml-3 text-sm'>
                  <label
                    htmlFor='remember'
                    className='font-medium text-black-1'
                  >
                    I agree to the{' '}
                    <Link href='/terms' className='underline'>
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href='/privacy' className='underline'>
                      Privacy Policy
                    </Link>
                  </label>
                </div>
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
            Continue
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
