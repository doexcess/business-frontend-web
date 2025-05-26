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
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import Icon from '../ui/Icon';
import { resolveAccount } from '@/redux/slices/orgSlice';
import { resolveAccountFormSchema } from '@/lib/schema/org.schema';
import useBanks from '@/hooks/page/useBanks';
import Joi from 'joi';
import LoadingIcon from '../ui/icons/LoadingIcon';

const BankAccountSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { banks, loading, error } = useBanks();
  // const { bankLoading, account, error } = useSelector(
  //   (state: RootState) => state.org
  // );

  const [formData, setFormData] = useState({
    account_number: '',
    bank_code: '',
  });

  const [formError, setFormError] = useState('');
  const [accountName, setAccountName] = useState('');

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = resolveAccountFormSchema.validate(formData);
    if (error) {
      setFormError(error.details[0].message);
      return;
    }

    try {
      const result = await dispatch(resolveAccount(formData)).unwrap();
      console.log(result);
      // setAccountName(result.details.account_name);
    } catch (err: any) {
      setFormError(typeof err === 'string' ? err : 'Something went wrong');
    }
  };

  return (
    <Card className='max-w-xl mx-auto'>
      <CardHeader>
        <CardTitle>Bank Account Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label>Bank</Label>
            <Select
              onValueChange={(value) => handleChange('bank_code', value)}
              value={formData.bank_code}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select bank' />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value='loading'>Loading...</SelectItem>
                ) : (
                  banks.map((bank: any) => (
                    <SelectItem key={bank.code} value={bank.code}>
                      {bank.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Account Number</Label>
            <Input
              type='text'
              maxLength={11}
              value={formData.account_number}
              onChange={(e) => handleChange('account_number', e.target.value)}
            />
          </div>

          {accountName && (
            <div>
              <Label>Account Name</Label>
              <Input value={accountName} readOnly />
            </div>
          )}

          {formError && <p className='text-red-500 text-sm'>{formError}</p>}
          {error && <p className='text-red-500 text-sm'>{error}</p>}

          <Button type='submit' disabled={loading}>
            {loading ? (
              <>
                <LoadingIcon />
                Resolving...
              </>
            ) : (
              'Resolve Account'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BankAccountSettings;
