'use client';

import React, { useState } from 'react';
import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import { CiBank } from 'react-icons/ci';
import { FaArrowDown, FaArrowUp, FaListUl, FaWallet } from 'react-icons/fa6';
import { cn, formatMoney, SystemRole } from '@/lib/utils'; // optional utility for className handling
import { Modal } from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import usePayments from '@/hooks/page/usePayments';
import PaymentList from '@/components/dashboard/payment/PaymentList';

const Wallet = () => {
  const { org: organization } = useSelector((state: RootState) => state.org);
  const { profile } = useSelector((state: RootState) => state.auth);

  const { total_credit, total_debit, total_trx } = usePayments();

  const walletBalance = formatMoney(
    +organization?.business_wallet?.balance! || 0,
    organization?.business_wallet?.currency
  );
  const totalTransactions = formatMoney(
    total_trx,
    organization?.business_wallet?.currency
  );
  const totalCredit = formatMoney(
    total_credit,
    organization?.business_wallet?.currency
  );
  const totalDebit = formatMoney(
    total_debit,
    organization?.business_wallet?.currency
  );

  const [isWithdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const handleWithdraw = () => {
    // Add actual withdraw logic here (API call)
    alert(`Withdraw request of ₦${withdrawAmount} sent.`);
    setWithdrawModalOpen(false);
    setWithdrawAmount('');
  };

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container space-y-6'>
        {/* Header */}
        <PageHeading
          title='Wallet'
          brief='Track and access your funds effortlessly'
          enableBreadCrumb={true}
          layer2='Wallet'
          ctaButtons={
            <div
              className={cn(
                'flex-shrink-0 self-start',
                profile?.role?.role_id !== SystemRole.BUSINESS_SUPER_ADMIN &&
                  'hidden'
              )}
            >
              <Button
                variant='primary'
                className='text-md gap-2 py-2 rounded-lg'
                onClick={() => setWithdrawModalOpen(true)}
              >
                <CiBank className='text-lg' />
                Withdraw Funds
              </Button>
            </div>
          }
        />

        {/* Wallet Balance */}
        {/* Wallet Stat Cards */}
        <section className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Total Transactions */}
          <div className='rounded-lg p-5 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm flex items-center gap-4'>
            <div className='p-3 bg-primary/10 text-primary rounded-full'>
              <FaListUl className='dark:text-white' />
            </div>
            <div>
              <p className=' text-gray-500 dark:text-white'>
                Total Transactions
              </p>
              <h4 className='text-xl font-bold text-gray-800 dark:text-white'>
                {totalTransactions}
              </h4>
            </div>
          </div>

          {/* Total Credit */}
          <div className='rounded-lg p-5 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm flex items-center gap-4'>
            <div className='p-3 bg-green-100 text-green-600 rounded-full'>
              <FaArrowDown />
            </div>
            <div>
              <p className=' text-gray-500 dark:text-white'>Total Credit</p>
              <h4 className='text-xl font-bold text-green-600'>
                {totalCredit}
              </h4>
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
              <h4 className='text-xl font-bold dark:text-primary-faded text-primary-main'>
                {walletBalance}
              </h4>
            </div>
          </div>
        </section>

        <PaymentList />

        {/* Withdraw Modal */}
        <Modal
          isOpen={isWithdrawModalOpen}
          onClose={() => setWithdrawModalOpen(false)}
          title='Withdraw Funds'
        >
          <div className='space-y-4'>
            <div>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Available Balance
              </p>
              <p className='text-xl font-semibold text-blue-600'>
                {walletBalance}
              </p>
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

            <div className='flex justify-end gap-2'>
              <Button
                variant='outline'
                className='dark:border-gray-600 dark:text-white text-gray-600'
                onClick={() => setWithdrawModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={!withdrawAmount || Number(withdrawAmount) <= 0}
                onClick={handleWithdraw}
                className='dark:text-white'
              >
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
