'use client';

import Filter from '@/components/Filter';
import Pagination from '@/components/Pagination';
import usePayments from '@/hooks/page/usePayments';
import {
  cn,
  formatMoney,
  getAvatar,
  PaymentStatus,
  shortenId,
} from '@/lib/utils';
import moment from 'moment-timezone';
import Link from 'next/link';
import React from 'react';

export enum RetrievalType {
  RECENT = 'recent',
  ALL = 'all',
}
interface PaymentListProps {
  retrieve?: RetrievalType;
}
const PaymentList = ({ retrieve = RetrievalType.RECENT }: PaymentListProps) => {
  const {
    payments,
    loading,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
    count,
  } = usePayments();

  const shimmerRows = Array.from({ length: 5 });

  return (
    <>
      {/* Transactions */}
      <section
        className={cn(
          '',
          retrieve === RetrievalType.RECENT &&
            'rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 p-6 shadow-sm'
        )}
      >
        {retrieve === RetrievalType.RECENT && (
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
              Recent Transactions
            </h3>
            <Link href='/payments' className='dark:text-white'>
              View All
            </Link>
          </div>
        )}

        {retrieve === RetrievalType.ALL && (
          <Filter
            showSearch={true}
            searchPlaceholder='Search payments'
            handleFilterByDateSubmit={handleFilterByDateSubmit}
            handleRefresh={handleRefresh}
            handleSearchSubmit={handleSearchSubmit}
          />
        )}

        {loading ? (
          <div className='overflow-x-auto animate-pulse'>
            <table className='w-full text-sm text-left text-gray-700 dark:text-gray-200'>
              <thead className='text-xs uppercase bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'>
                <tr>
                  <th className='px-4 py-3'>Date</th>
                  <th className='px-4 py-3'>Transaction ID</th>
                  <th className='px-4 py-3'>Type</th>
                  <th className='px-4 py-3'>User</th>
                  <th className='px-4 py-3'>Amount</th>
                  <th className='px-4 py-3'>Status</th>
                </tr>
              </thead>
              <tbody>
                {shimmerRows.map((_, idx) => (
                  <tr
                    key={idx}
                    className='border-b dark:border-gray-600 bg-white dark:bg-gray-800'
                  >
                    {[...Array(6)].map((__, cellIdx) => (
                      <td key={cellIdx} className='px-4 py-3'>
                        <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4'></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : payments.length > 0 ? (
          <div className='overflow-x-auto rounded-xl shadow-md border border-gray-200 dark:border-gray-700'>
            <table className='w-full text-base text-left text-gray-700 dark:text-gray-200'>
              <thead className='text-sm uppercase bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'>
                <tr>
                  {[
                    'Date',
                    'Transaction ID',
                    'Type',
                    'User',
                    'Amount',
                    'Status',
                  ].map((heading) => (
                    <th key={heading} className='px-6 py-4 whitespace-nowrap'>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className='text-sm'>
                {payments.map((txn, idx) => {
                  const isEvenRow = idx % 2 === 0;
                  const rowClasses = cn(
                    'border-b dark:border-gray-700',
                    isEvenRow
                      ? 'bg-white dark:bg-gray-900'
                      : 'bg-gray-50 dark:bg-gray-800'
                  );

                  const user = txn.user;
                  const profilePic = user?.profile?.profile_picture;
                  const displayAvatar = profilePic || user?.name;

                  return (
                    <tr key={txn.id} className={rowClasses}>
                      {/* Date */}
                      <td className='px-6 py-4 min-w-[140px] text-sm'>
                        {moment(txn.created_at).format('LL')}
                      </td>

                      {/* Transaction ID */}
                      <td className='px-6 py-4'>
                        <Link
                          href={`/payments/${txn.id}/details`}
                          className='hover:underline font-medium'
                        >
                          {shortenId(txn.id)}
                        </Link>
                      </td>

                      {/* Type */}
                      <td className='px-6 py-4'>{txn.purchase_type}</td>

                      {/* User */}
                      <td className='px-6 py-4 min-w-[200px]'>
                        <div className='flex items-center gap-3'>
                          {displayAvatar && (
                            <img
                              src={getAvatar(profilePic!, user?.name)}
                              alt={user?.name}
                              className='w-10 h-10 rounded-full object-cover'
                            />
                          )}
                          <span className='font-semibold truncate text-gray-800 dark:text-gray-100'>
                            {user?.name || '-'}
                          </span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className='px-6 py-4 font-medium'>
                        {formatMoney(+txn.amount, txn.currency)}
                      </td>

                      {/* Status */}
                      <td className='px-6 py-4'>
                        <span
                          className={cn(
                            'inline-block px-3 py-1 rounded-full text-xs font-semibold',
                            txn.payment_status === PaymentStatus.SUCCESS
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          )}
                        >
                          {txn.payment_status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className='text-center text-gray-500 dark:text-gray-400 py-6'>
            No transactions found yet.
          </p>
        )}

        {retrieve === RetrievalType.ALL && (
          <Pagination
            noMoreNextPage={true}
            total={count}
            onClickNext={onClickNext}
            onClickPrev={onClickPrev}
          />
        )}
      </section>
    </>
  );
};

export default PaymentList;
