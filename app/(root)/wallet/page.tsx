'use client';

import React, { useState } from 'react';
import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import { CiBank } from 'react-icons/ci';
import { FaArrowDown, FaArrowUp, FaListUl, FaWallet } from 'react-icons/fa6';
import { cn, formatMoney, SystemRole } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import usePayments from '@/hooks/page/usePayments';
import PaymentList from '@/components/dashboard/payment/PaymentList';
import useOrg from '@/hooks/page/useOrg';
import { createWithdrawal, fetchWithdrawals } from '@/redux/slices/withdrawalSlice';
import toast from 'react-hot-toast';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import WithdrawalList from '@/components/dashboard/withdrawal/WithdrawalList';

const Wallet = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { org: organization } = useSelector((state: RootState) => state.org);
  const { org } = useOrg(organization?.id!);
  const { profile } = useSelector((state: RootState) => state.auth);
  const { total_credit, total_debit, total_trx } = usePayments();

  const [isLoading, setIsLoading] = useState(false);
  const [isWithdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawPassword, setWithdrawPassword] = useState('');

  const walletBalance = formatMoney(+org?.business_wallet?.balance! || 0, org?.business_wallet?.currency);
  const totalTransactions = formatMoney(total_trx, org?.business_wallet?.currency);
  const totalCredit = formatMoney(total_credit, org?.business_wallet?.currency);
  const totalDebit = formatMoney(total_debit, org?.business_wallet?.currency);

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return;
    if (!withdrawPassword) {
      toast.error('Please enter your password');
      return;
    }

    const payload = {
      amount: Number(withdrawAmount),
      currency: org?.business_wallet?.currency || 'NGN',
      password: withdrawPassword,
    };

    setIsLoading(true);

    try {
      const resultAction = await dispatch(
        createWithdrawal({
          payload,
          business_id: org?.id!,
        })
      );

      if (resultAction.type === 'withdrawal/create/rejected') {
        throw new Error(resultAction.payload as string);
      }

      toast.success('Withdrawal request created successfully');
      dispatch(fetchWithdrawals({ page: 1, limit: 5 }));
      setWithdrawAmount('');
      setWithdrawPassword('');
      setWithdrawModalOpen(false);

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container space-y-6'>


        <PageHeading
          title='Wallet'
          brief='Track and access your funds effortlessly'
          enableBreadCrumb={true}
          layer2='Wallet'
          ctaButtons={
            <div className={cn(
              'flex-shrink-0 self-start',
              profile?.role?.role_id !== SystemRole.BUSINESS_SUPER_ADMIN && 'hidden'
            )}>
              <Button
                variant='primary'
                className='text-md gap-2 py-2 rounded-lg'
                onClick={() => setWithdrawModalOpen(true)}>
                <CiBank className='text-lg' />
                Withdraw Funds
              </Button>
            </div>
          }
        />

        {/* Wallet Stat Cards */}
        <section className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>

          <div className='rounded-lg p-5 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm flex items-center gap-4'>
            <div className='p-3 bg-primary/10 text-primary rounded-full'>
              <FaListUl className='dark:text-white' />
            </div>
            <div>
              <p className=' text-gray-500 dark:text-white'>Total Transactions</p>
              <h4 className='text-xl font-bold text-gray-800 dark:text-white'>{totalTransactions}</h4>
            </div>
          </div>

          {/* Total Credit */}
          <div className='rounded-lg p-5 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm flex items-center gap-4'>
            <div className='p-3 bg-green-100 text-green-600 rounded-full'>
              <FaArrowDown />
            </div>
            <div>
              <p className=' text-gray-500 dark:text-white'>Total Credit</p>
              <h4 className='text-xl font-bold text-green-600'>{totalCredit}</h4>
            </div>
          </div>

          {/* Total Debit */}
          <div className='rounded-lg p-5 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm flex items-center gap-4'>
            <div className='p-3 bg-red-100 text-red-600 rounded-full'>
              <FaArrowUp />
            </div>
            <div>
              <p className=' text-gray-500 dark:text-white'>Total Debit</p>
              <h4 className='text-xl font-bold text-red-600'>{totalDebit}</h4>
            </div>
          </div>

          {/* Available Funds */}
          <div className='rounded-lg p-5 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm flex items-center gap-4'>
            <div className='p-3 bg-blue-100 text-primary-main rounded-full'>
              <FaWallet />
            </div>
            <div>
              <p className=' text-gray-500 dark:text-white'>Available Funds</p>
              <h4 className='text-xl font-bold dark:text-primary-faded text-primary-main'>{walletBalance}</h4>
            </div>
          </div>

        </section>

        {/* Payments and Withdrawals */}
        <PaymentList />

        <WithdrawalList />

        {/* Withdraw Modal */}
        <Modal
          isOpen={isWithdrawModalOpen}
          onClose={() => setWithdrawModalOpen(false)}
          title='Withdraw Funds'>

          <div className='space-y-4'>

            <div>
              <p className='text-sm text-gray-500 dark:text-gray-400'>Available Balance</p>
              <p className='text-xl font-semibold text-blue-600'>{walletBalance}</p>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Amount to Withdraw
              </label>
              <Input
                type='number'
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder='₦5000'
                className='w-full px-4 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-600 dark:text-white'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Password
              </label>
              <Input
                type='password'
                value={withdrawPassword}
                onChange={(e) => setWithdrawPassword(e.target.value)}
                placeholder='Enter your password'
                className='w-full px-4 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-600 dark:text-white'
              />
            </div>

            {/* Modal Buttons */}
            <div className='flex justify-end gap-2'>

                <Button
                  variant='outline'
                  className='dark:border-gray-600 dark:text-white text-gray-600'
                  onClick={() => setWithdrawModalOpen(false)}>
                  Cancel
                </Button>

                <Button
                  disabled={!withdrawAmount || Number(withdrawAmount) <= 0 || !withdrawPassword}
                  onClick={handleWithdraw}
                  className='dark:text-white'>
                  {isLoading && <LoadingIcon />}
                  Submit
                </Button>

            </div>

          </div>

        </Modal>

      </div>

    </main>
  );
};

export default Wallet;
