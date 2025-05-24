'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AcceptInviteProps, acceptInviteSchema } from '@/lib/schema/org.schema';
import Input from '../ui/Input';
import { Button } from '../ui/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import toast from 'react-hot-toast';
import { acceptInvite } from '@/redux/slices/orgSlice';
import LoadingIcon from '../ui/icons/LoadingIcon';

const defaultValue: AcceptInviteProps = {
  name: '',
  password: '',
  token: '',
};

const JoinInvitationForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    password: '',
    organization: 'Mx Technologies', // You can dynamically fetch this if needed
  });

  const [body, setBody] = useState<AcceptInviteProps>({
    ...defaultValue,
    token: searchParams.get('token')!,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBody({ ...body, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      console.log(body);
      console.log(searchParams.get('token')!);

      const { error, value } = acceptInviteSchema.validate(body);
      if (error) throw new Error(error.details[0].message);

      // Submit logic here
      const response: any = await dispatch(
        acceptInvite({
          ...body,
        })
      );

      if (response.type === 'contact/accept-invite/rejected') {
        throw new Error(response.payload.message);
      }

      toast.success(response.payload.message);
      router.push('/auth/signin');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = body.name && body.password.trim();

  return (
    <form onSubmit={handleSubmit} className='w-full'>
      <div className='space-y-4 mb-6 sm:mb-8'>
        <div className='space-y-4'>
          {/* Name */}
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Name
            </label>
            <Input
              type='text'
              name='name'
              id='name'
              value={body.name}
              onChange={handleChange}
              enableDarkMode={false}
              required
              // className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Password
            </label>
            <div className='relative'>
              <Input
                type={showPassword ? 'text' : 'password'}
                name='password'
                id='password'
                value={body.password}
                onChange={handleChange}
                enableDarkMode={false}
                required
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Organization (readonly display) */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Organization
            </label>
            <Input
              type='text'
              value={formData.organization}
              readOnly
              enableDarkMode={false}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type='submit'
        className={cn(
          'w-full py-3 px-4 rounded-lg font-medium text-white transition-all ',
          isFormValid
            ? 'bg-primary-main hover:bg-primary-800'
            : 'bg-primary-faded cursor-not-allowed'
        )}
      >
        {isSubmitting ? (
          <span className='flex items-center justify-center'>
            <LoadingIcon />
            Processing...
          </span>
        ) : (
          'Join Organization'
        )}
      </button>
    </form>
  );
};

export default JoinInvitationForm;
