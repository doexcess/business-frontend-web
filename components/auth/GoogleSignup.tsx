import React from 'react';
import { Button } from '../ui/Button';
import Image from 'next/image';
import { useGoogleLogin } from '@/hooks/useGoogleLogin';
import { googleLogin } from '@/redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import toast from 'react-hot-toast';
import { actualRole, SignupRole, SystemRole } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const GoogleSignup = ({ role }: { role: SignupRole | string; }) => {

  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { loginWithGoogle } = useGoogleLogin();

  // 🔁 Map role to loginRole
  const authRole = actualRole(role)

  const handleReg = () => {
    loginWithGoogle({
      onSuccess: async (token) => {

        try {

          const response: any = await dispatch(googleLogin({ token: token, provider: 'GOOGLE', role: authRole, action_type: 'SIGNUP' })).unwrap();
          toast.success(response.message);

          const route = [
            SystemRole.BUSINESS_SUPER_ADMIN,
            SystemRole.BUSINESS_ADMIN,
          ].includes(response.data.role)
            ? '/home'
            : '/dashboard/home';

          router.push(route);

        } catch (error: any) {
          toast.error(error?.message);
        }

      },
      onError: (error) => {
        console.error('Google Login Error:', error);
      },
    });
  };

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
        onClick={handleReg}
        className='mt-6 sm:mt-8 !text-primary-main w-full border-primary-main flex gap-2 hover:bg-primary-main hover:!text-white'
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
    </>
  );
};

export default GoogleSignup;
