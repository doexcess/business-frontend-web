import React from 'react';
import { Button } from '../ui/Button';
import Image from 'next/image';

const GoogleLogin = () => {
  return (
    <>
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
    </>
  );
};

export default GoogleLogin;
