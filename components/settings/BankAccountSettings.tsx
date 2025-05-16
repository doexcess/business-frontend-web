'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Input from '../ui/Input';
import { Label } from '../ui/label';
import { Button } from '../ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import Icon from '../ui/Icon';

const BankAccountSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg('');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // You can dispatch to Redux here or call an API
      // dispatch(updateBankDetails({ bankName, accountNumber }));

      setSuccessMsg('Bank details updated successfully');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='text-black-1 dark:text-white'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <Card className='dark:border-gray-600'>
          <CardHeader>
            <CardTitle>Bank Account Information</CardTitle>
          </CardHeader>

          <CardContent className='space-y-6'>
            <div className='w-full md:max-w-sm bg-gradient-to-br from-indigo-600 via-blue-500 to-purple-600 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden'>
              <div className='flex flex-col gap-4 mt-6'>
                {/* Bank Name */}
                <div>
                  <div className='text-xs uppercase tracking-wide text-gray-200'>
                    Bank
                  </div>
                  <div className='text-base font-semibold'>
                    {bankName || 'Select a bank'}
                  </div>
                </div>

                {/* Account Number */}
                <div>
                  <div className='text-xs uppercase tracking-wide text-gray-200'>
                    Account Number
                  </div>
                  <div className='text-lg font-mono tracking-widest'>
                    {accountNumber || '0000000000'}
                  </div>
                </div>

                {/* Account Name */}
                <div>
                  <div className='text-xs uppercase tracking-wide text-gray-200'>
                    Account Name
                  </div>
                  <div className='text-base font-semibold'>
                    {accountName || 'Your Name Here'}
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Name */}
            <div className='space-y-2'>
              <Label htmlFor='bank'>Bank Name</Label>
              <Select value={bankName} onValueChange={setBankName}>
                <SelectTrigger id='bank' className='w-full'>
                  <SelectValue placeholder='Select your bank' />
                </SelectTrigger>
                <SelectContent className='bg-gray-800'>
                  {[
                    'Access Bank',
                    'GTBank',
                    'UBA',
                    'First Bank',
                    'Zenith Bank',
                    'Kuda Bank',
                  ].map((bank, index) => (
                    <SelectItem key={index} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Account Number */}
            <div className='space-y-2'>
              <Label htmlFor='account-number'>Account Number</Label>
              <Input
                id='account-number'
                type='text'
                inputMode='numeric'
                maxLength={10}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder='Enter 10-digit account number'
                required
              />
            </div>

            {/* Account Name */}
            <div className='space-y-2'>
              <Label htmlFor='account-name'>Account Name</Label>
              <Input
                id='account-name'
                type='text'
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder='Enter account name'
                required
              />
            </div>

            {/* Submit Button */}
            <div className='pt-4'>
              <Button
                type='submit'
                variant='primary'
                disabled={isLoading}
                className='w-full md:w-auto flex gap-2 items-center'
              >
                {isLoading && (
                  <Icon
                    url='/icons/loader.svg'
                    className='animate-spin w-4 h-4'
                  />
                )}
                Save Bank Details
              </Button>

              {successMsg && (
                <p className='mt-2 text-green-600 dark:text-green-400 text-sm'>
                  {successMsg}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default BankAccountSettings;
