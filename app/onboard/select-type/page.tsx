'use client';

import { cn } from '@/lib/utils';
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
    <div className='min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-light font-gilroy'>
      <Head>
        <title>Select User Type</title>
      </Head>

      <div className='border-2 border-white rounded-2xl w-[646px] bg-primary-light p-[40px] h-[700px]'>
        <div className='w-[566px] rounded-2xl p-8 bg-white h-[600px] flex flex-col items-center justify-center'>
          <a
            href='#'
            className='flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-6'
          >
            <Image
              src={'/icons/icon.png'}
              width={60}
              height={60}
              alt='Logo icon'
              className='m-auto block rounded-lg'
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
            <div className='flex justify-center space-x-4'>
              <button
                onClick={() => handleRoleSelect('Business Owner')}
                className={cn(
                  'flex flex-col justify-center items-center rounded-xl border-2 transition-all pt-[24px] pr-[10px] pb-[11px] pl-[10px] ',
                  selectedRole === 'Business Owner'
                    ? 'border-primary-main bg-primary-main text-white'
                    : 'border-gray-300 hover:border-gray-400 text-primary-main'
                )}
              >
                <Image
                  src={'/icons/user-type/business-owner.svg'}
                  alt='business-owner'
                  width={50}
                  height={50}
                  className={cn(
                    '',
                    selectedRole === 'Business Owner' && 'invert brightness-0'
                  )}
                  objectFit='contain'
                />
                <span>Business Owner</span>
              </button>

              <button
                onClick={() => handleRoleSelect('Client')}
                className={cn(
                  'flex flex-col justify-center items-center rounded-xl border-2 transition-all pt-[24px] pr-[36px] pb-[11px] pl-[36px] w-[130px]',
                  selectedRole === 'Client'
                    ? 'border-primary-main bg-primary-main text-white'
                    : 'border-gray-300 hover:border-gray-400 text-primary-main'
                )}
              >
                <Image
                  src='/icons/user-type/client.svg'
                  alt='client'
                  width={50}
                  height={50}
                  className={cn(
                    '',
                    selectedRole === 'Client' && 'invert brightness-0'
                  )}
                  objectFit='contain'
                />
                <span>Client</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
              selectedRole
                ? 'bg-primary-main hover:bg-primary-800'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectType;
