'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Input from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { updatePassword } from '@/redux/slices/authSlice';
import toast from 'react-hot-toast';

const defaultValue = {
  current_password: '',
  new_password: '',
  confirm_password: '',
};

const SecuritySettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [body, setBody] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBody((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      // Validate password match
      if (body.new_password !== body.confirm_password) {
        throw new Error('New password and confirmation do not match');
      }

      // Dispatch your update action here
      const response: any = await dispatch(updatePassword(body));

      if (
        response?.requestStatus === 'rejected' ||
        response?.meta?.requestStatus === 'rejected'
      ) {
        throw new Error(response.payload?.message);
      }

      toast.success(response?.payload?.message);
      setBody(defaultValue); // Reset form on success
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='text-black-1 dark:text-white'>
      <form className='space-y-6' onSubmit={handleSubmit}>
        <Card className='dark:border-gray-800'>
          <CardHeader>
            <CardTitle>Password</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4 '>
            <div className='grid gap-4'>
              <div className='relative'>
                <Label htmlFor='current-password'>Current Password</Label>
                <Input
                  id='current-password'
                  type={showCurrentPassword ? 'text' : 'password'}
                  name='current_password'
                  onChange={handleChange}
                  value={body.current_password}
                  required
                />
                <button
                  type='button'
                  className='absolute right-3 top-9 text-muted-foreground hover:text-primary'
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>

              <div className='relative'>
                <Label htmlFor='new-password'>New Password</Label>
                <Input
                  id='new-password'
                  type={showNewPassword ? 'text' : 'password'}
                  name='new_password'
                  onChange={handleChange}
                  value={body.new_password}
                  required
                />
                <button
                  type='button'
                  className='absolute right-3 top-9 text-muted-foreground hover:text-primary'
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>

              <div className='relative'>
                <Label htmlFor='confirm-password'>Confirm Password</Label>
                <Input
                  id='confirm-password'
                  type={showConfirmPassword ? 'text' : 'password'}
                  name='confirm_password'
                  onChange={handleChange}
                  value={body.confirm_password}
                  required
                />
                <button
                  type='button'
                  className='absolute right-3 top-9 text-muted-foreground hover:text-primary'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add later */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Two-Factor Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between'>
              <div>
                <Label>Enable 2FA</Label>
                <p className='text-sm text-muted-foreground'>
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch disabled checked />
            </div>
          </CardContent>
        </Card> */}

        <div className='flex justify-end'>
          <Button size={'sm'} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={20} className='animate-spin' /> &nbsp; Loading...
              </>
            ) : (
              'Update Security'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SecuritySettings;
