'use client';

import Head from 'next/head';
import Image from 'next/image';
import React, { useState } from 'react';

const SelectType = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      // Here you would typically redirect or handle the selection
      console.log(`Selected role: ${selectedRole}`);
      // router.push(`/${selectedRole.toLowerCase().replace(' ', '-')}`);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4'>
      <Head>
        <title>Select User Type</title>
      </Head>

      <div className='w-full max-w-md bg-white rounded-lg shadow-md p-8'>
        <a
          href='#'
          className='flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white'
        >
          <Image
            src={'/logo.png'}
            width={150}
            height={150}
            alt='Logo'
            className='m-auto block dark:hidden'
            priority
          />
          <Image
            src={'/logo-white.png'}
            width={150}
            height={150}
            alt='Logo'
            className='m-auto hidden dark:block'
            priority
          />
        </a>
        <h1 className='text-2xl font-bold text-center text-gray-800 mb-2'>
          Select User Type
        </h1>
        <p className='text-gray-600 text-center mb-6'>
          Please select your role to proceed
        </p>

        <div className='flex flex-col space-y-4 mb-8'>
          <div className='flex justify-between space-x-4'>
            <button
              onClick={() => handleRoleSelect('Business Owner')}
              className={`flex-1 py-4 px-6 rounded-lg border-2 transition-all ${
                selectedRole === 'Business Owner'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <span className='font-medium'>Business Owner</span>
            </button>

            <button
              onClick={() => handleRoleSelect('Client')}
              className={`flex-1 py-4 px-6 rounded-lg border-2 transition-all ${
                selectedRole === 'Client'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <span className='font-medium'>Client</span>
            </button>
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
            selectedRole
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SelectType;
