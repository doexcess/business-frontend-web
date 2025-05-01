import React, { useState } from 'react';
import Input from '../ui/Input';
import Link from 'next/link';

const SigninForm = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleSubmit = () => {};

  return (
    <>
      <form onSubmit={handleSubmit} className='w-full'>
        <div className='w-full space-y-4 mb-6 sm:mb-8'>
          <div className='space-y-4'>
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
              <Link
                href='/auth/forgot-password'
                className='text-primary-main font-bold'
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>

        <button
          type='submit'
          disabled={!selectedRole}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
            selectedRole
              ? 'bg-primary-main hover:bg-primary-800'
              : 'bg-primary-faded cursor-not-allowed'
          }`}
        >
          Sign in
        </button>
      </form>
    </>
  );
};

export default SigninForm;
