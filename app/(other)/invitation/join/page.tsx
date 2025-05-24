'use client';

import React, { useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import JoinInvitationForm from '@/components/other/JoinInvitationForm';

const JoinInvitation = () => {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    organization: 'Mx Technologies', // You can dynamically fetch this if needed
  });

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

          <h1 className='text-xl sm:text-2xl font-bold text-gray-800'>
            Join{' '}
            <span className='text-primary-main'>{formData.organization}</span>
          </h1>
          <p className='text-sm sm:text-base text-gray-600 mt-2 text-center mb-6 max-w-md'>
            You're almost there. Just complete the form below to join your team.
          </p>

          <JoinInvitationForm />
        </div>
      </div>
    </div>
  );
};

export default JoinInvitation;
