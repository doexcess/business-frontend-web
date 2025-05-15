'use client';

import React, { useState } from 'react';
import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import { CiBank } from 'react-icons/ci';
import {
  FaArrowDown,
  FaArrowUp,
  FaListUl,
  FaPlus,
  FaWallet,
} from 'react-icons/fa6';
import { Table } from '@/components/ui/table'; // hypothetical reusable table component
import { cn } from '@/lib/utils'; // optional utility for className handling
import { Modal } from '@/components/ui/Modal';

const mockTransactions = [
  {
    id: 'TXN-001',
    type: 'Credit',
    amount: 25000,
    method: 'Course Purchase',
    date: 'May 14, 2025',
    status: 'Completed',
  },
  {
    id: 'TXN-002',
    type: 'Debit',
    amount: -10000,
    method: 'Withdrawal',
    date: 'May 10, 2025',
    status: 'Pending',
  },
];

const Wallet = () => {
  const walletBalance = 38000;
  const totalTransactions = 12;
  const totalCredit = 125000;
  const totalDebit = 87000;

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
          enableBreadCrumb={true}
          layer2='Wallet'
          ctaButtons={
            <Button
              className='text-md gap-2 bg-primary px-4 py-2 rounded-lg w-48'
              onClick={() => setWithdrawModalOpen(true)}
            >
              <CiBank className='text-lg' />
              Withdraw Funds
            </Button>
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
              <p className='text-sm text-gray-500 dark:text-gray-400'>
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
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Total Credit
              </p>
              <h4 className='text-xl font-bold text-green-600'>
                ₦{totalCredit.toLocaleString()}
              </h4>
            </div>
          </div>

          {/* Total Debit */}
          <div className='rounded-lg p-5 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm flex items-center gap-4'>
            <div className='p-3 bg-red-100 text-red-600 rounded-full'>
              <FaArrowUp />
            </div>
            <div>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Total Debit
              </p>
              <h4 className='text-xl font-bold text-red-600'>
                ₦{totalDebit.toLocaleString()}
              </h4>
            </div>
          </div>

          {/* Available Funds */}
          <div className='rounded-lg p-5 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm flex items-center gap-4'>
            <div className='p-3 bg-blue-100 text-blue-600 rounded-full'>
              <FaWallet />
            </div>
            <div>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Available Funds
              </p>
              <h4 className='text-xl font-bold text-blue-600'>
                ₦{walletBalance.toLocaleString()}
              </h4>
            </div>
          </div>
        </section>

        {/* Transactions */}
        <section className='rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 p-6 shadow-sm'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
              Recent Transactions
            </h3>
            <Button size='sm' variant='ghost' className='text-primary'>
              View All
            </Button>
          </div>

          {mockTransactions.length > 0 ? (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm text-left text-gray-700 dark:text-gray-200'>
                <thead className='text-xs uppercase bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'>
                  <tr>
                    <th scope='col' className='px-4 py-3'>
                      Date
                    </th>
                    <th scope='col' className='px-4 py-3'>
                      Transaction ID
                    </th>
                    <th scope='col' className='px-4 py-3'>
                      Type
                    </th>
                    <th scope='col' className='px-4 py-3'>
                      Method
                    </th>
                    <th scope='col' className='px-4 py-3'>
                      Amount
                    </th>
                    <th scope='col' className='px-4 py-3'>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockTransactions.map((txn, idx) => (
                    <tr
                      key={idx}
                      className={cn(
                        'border-b dark:border-gray-600',
                        idx % 2 === 0
                          ? 'bg-white dark:bg-gray-800'
                          : 'bg-gray-50 dark:bg-gray-900'
                      )}
                    >
                      <td className='px-4 py-3'>{txn.date}</td>
                      <td className='px-4 py-3'>{txn.id}</td>
                      <td className='px-4 py-3'>{txn.type}</td>
                      <td className='px-4 py-3'>{txn.method}</td>
                      <td className='px-4 py-3'>
                        <span
                          className={
                            txn.amount < 0 ? 'text-red-500' : 'text-green-500'
                          }
                        >
                          ₦{Math.abs(txn.amount).toLocaleString()}
                        </span>
                      </td>
                      <td className='px-4 py-3'>
                        <span
                          className={cn(
                            'px-2 py-1 rounded text-xs font-medium',
                            txn.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          )}
                        >
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className='text-center text-gray-500 dark:text-gray-400 py-6'>
              No transactions found yet.
            </p>
          )}
        </section>
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
                ₦{walletBalance.toLocaleString()}
              </p>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Amount to Withdraw
              </label>
              <input
                type='number'
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder='₦5000'
                className='w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              />
            </div>

            <div className='flex justify-end gap-2'>
              <Button
                variant='outline'
                onClick={() => setWithdrawModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={!withdrawAmount || Number(withdrawAmount) <= 0}
                onClick={handleWithdraw}
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
