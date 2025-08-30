import React, { useEffect, useState } from 'react';
import Input from '../ui/Input';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
  RequestPasswordResetFormSchema,
  SavePasswordByTokenFormSchema,
  SavePasswordByTokenProps,
} from '@/lib/schema/auth.schema';
import toast from 'react-hot-toast';
import {
  requestPasswordReset,
  setPasswordByToken,
} from '@/redux/slices/authSlice';
import LoadingIcon from '../ui/icons/LoadingIcon';
import { Eye, EyeOff } from 'lucide-react';
import Icon from '../ui/Icon';
import XIcon from '../ui/icons/XIcon';
import { useRouter } from 'next/navigation';

const defaultValue = {
  token: '',
  password: '',
};

type PasswordStrength = {
  length: boolean;
  lowercase: boolean;
  uppercase: boolean;
  specialChar: boolean;
  digit: boolean;
};

interface ChangePasswordFormSchema {
  token: string;
}
const SetNewPasswordForm = ({ token }: ChangePasswordFormSchema) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [body, setBody] = useState(defaultValue);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    length: false,
    lowercase: false,
    uppercase: false,
    specialChar: false,
    digit: false,
  });
  const [passwordScore, setPasswordScore] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const strength = {
      length: body.password.length >= 8,
      lowercase: /[a-z]/.test(body.password),
      uppercase: /[A-Z]/.test(body.password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(body.password),
      digit: /\d/.test(body.password),
    };
    setPasswordStrength(strength);
    setPasswordScore(Object.values(strength).filter(Boolean).length);
  }, [body.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBody((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setIsSubmitting(true);

      const { error, value } = SavePasswordByTokenFormSchema.validate(body);

      // Handle validation results
      if (error) {
        throw new Error(error.details[0].message);
      }

      const data: SavePasswordByTokenProps = {
        token: body.token,
        password: body.password,
      };

      const response: any = await dispatch(setPasswordByToken(body));

      if (response.type === 'auth/verify-email-save-password/rejected') {
        throw new Error(response.payload.message);
      }

      toast.success(response.payload.message);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = body.password.trim() !== '' && passwordScore === 5;

  return (
    <form className='w-full' onSubmit={handleSubmit}>
      <div className='w-full space-y-4 mb-6 sm:mb-8'>
        <div className='space-y-4'>
          <div className='relative'>
            <label
              htmlFor='password'
              className='block mb-2 text-sm font-bold text-gray-900'
            >
              Password
            </label>
            <Input
              type={showPassword ? 'text' : 'password'}
              name='password'
              placeholder='Create a password'
              className='w-full rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
              value={body.password}
              required
              onChange={handleChange}
              enableDarkMode={false}
            />
            <button
              type='button'
              onClick={() => setShowPassword((prev) => !prev)}
              className='absolute right-3 top-[31%] -translate-y-1/2 text-sm text-gray-600 hover:text-gray-900 focus:outline-none'
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            <div className='mt-3 text-xs sm:text-sm'>
              <div className='grid grid-cols-2 gap-2'>
                {[
                  { key: 'length', text: '8+ characters' },
                  { key: 'lowercase', text: 'Lowercase letter' },
                  { key: 'uppercase', text: 'Uppercase letter' },
                  { key: 'specialChar', text: 'Special character' },
                  { key: 'digit', text: 'Digit' },
                ].map((req) => (
                  <div key={req.key} className='flex items-center'>
                    <div
                      className={`mr-2 ${
                        passwordStrength[req.key as keyof PasswordStrength]
                          ? 'text-green-500'
                          : 'text-gray-400'
                      }`}
                    >
                      {passwordStrength[req.key as keyof PasswordStrength] ? (
                        <Icon url='/icons/auth/check.svg' />
                      ) : (
                        <XIcon className='text-red-500' />
                      )}
                    </div>
                    <span
                      className={
                        passwordStrength[req.key as keyof PasswordStrength]
                          ? 'text-gray-900'
                          : 'text-gray-500'
                      }
                    >
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor='password'
              className='block mb-2 text-sm font-bold text-gray-900'
            >
              Password Confirmation
            </label>
            <Input
              type='password'
              name='password'
              placeholder='Enter your password'
              className='w-full rounded-lg text-gray-900'
              value={body.password}
              required={true}
              enableDarkMode={false}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <button
        type='submit'
        disabled={!isFormValid || isSubmitting}
        className={`w-full text-sm py-3 px-4 rounded-lg font-medium text-white transition-all ${
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
          'Request'
        )}
      </button>
    </form>
  );
};

export default SetNewPasswordForm;
