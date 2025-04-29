'use client';

import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import OTPInput from '@/components/ui/OtpInput';
import { VerifyEmailFormSchema } from '@/lib/schema/auth.schema';
import { decryptInput, emailSplit, maskSensitiveData } from '@/lib/utils';
import { verifyEmail } from '@/redux/slices/authSlice';
import { AppDispatch } from '@/redux/store';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const defaultValue = {
  token: '',
  email: '',
};

const VerifyEmail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const params = useSearchParams();

  const decyptedData = decryptInput(params.get('token')!);

  const splitEmail = emailSplit(decyptedData);

  const [body, setBody] = useState({ ...defaultValue, email: decyptedData });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOTPComplete = (otp: string) => {
    setBody({ ...body, token: otp });
  };

  const isFormValid = body.token.length === 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    console.log(body);

    try {
      setIsSubmitting(true);

      const { error, value } = VerifyEmailFormSchema.validate(body);

      // Handle validation results
      if (error) {
        throw new Error(error.details[0].message);
      }

      const response: any = await dispatch(verifyEmail(body));

      if (response.type === 'auth/verify-email/rejected') {
        throw new Error(response.payload.message);
      }

      router.push(`/onboard/email-verified`);
    } catch (error: any) {
      console.error('Email verified failed:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <form onSubmit={handleSubmit}>
            <div className='space-y-4 mb-6 sm:mb-8'>
              <div className='space-y-4'>
                <div className='flex mt-5 mb-8 '>
                  <OTPInput
                    onComplete={handleOTPComplete}
                    allowDarkMode={false}
                    className='w-10 h-10 md:w-[50px] md:h-[50px]'
                  />
                </div>
              </div>
            </div>
            <button
              type='submit'
              disabled={!isFormValid || isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
                isFormValid
                  ? 'bg-primary-main hover:bg-primary-800'
                  : 'bg-primary-faded cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <span className='flex items-center justify-center'>
                  <LoadingIcon />
                  Processing...
                </span>
              ) : (
                'Proceed'
              )}
            </button>
          </form>
          <div className='flex flex-wrap justify-center gap-1 sm:gap-2 mt-6 sm:mt-8 mb-4 text-sm sm:text-base'>
            <p>Didn't receive any code?</p>
            <Link href='' className='text-primary-main font-bold'>
              Resend
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
