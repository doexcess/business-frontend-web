import React, { useState } from 'react';
import OTPInput from '../ui/OtpInput';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { decryptInput } from '@/lib/utils';
import { LoginProps, VerifyLoginFormSchema } from '@/lib/schema/auth.schema';
import { verifyLogin } from '@/redux/slices/authSlice';
import toast from 'react-hot-toast';
import ResendEmailOtp from './ResendEmailOtp';
import LoadingIcon from '../ui/icons/LoadingIcon';

const defaultValue = {
  email: '',
  otp: '',
};

const VerifySigninForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useSearchParams();

  const token = params.get('token')!;

  const decyptedData = JSON.parse(decryptInput(token)) as LoginProps;

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [body, setBody] = useState({
    ...defaultValue,
    email: decyptedData.email,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = () => {
    if (selectedRole) {
      console.log(`Selected role: ${selectedRole}`);
    }
  };

  const handleOTPComplete = (otp: string) => {
    setBody({ ...body, otp });
  };

  const isFormValid = body.otp.length === 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setIsSubmitting(true);

      const { error, value } = VerifyLoginFormSchema.validate(body);

      // Handle validation results
      if (error) {
        throw new Error(error.details[0].message);
      }

      const response: any = await dispatch(verifyLogin(body));

      if (response.type === 'auth/verify-otp/rejected') {
        throw new Error(response.payload.message);
      }

      toast.success(response.payload.message);
      router.push(`/`);
    } catch (error: any) {
      console.error('Signin verification failed:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='w-full space-y-2 sm:mb-8'>
        <div className='space-y-4'>
          <div className='flex justify-center mt-5 mb-4'>
            <OTPInput
              onComplete={handleOTPComplete}
              allowDarkMode={false}
              className='w-[50px] h-[50px]'
            />
          </div>
        </div>
      </div>

      <div className='w-full'>
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
        <ResendEmailOtp />
      </div>
    </form>
  );
};

export default VerifySigninForm;
