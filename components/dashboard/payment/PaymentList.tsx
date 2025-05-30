'use client';

import Filter from '@/components/Filter';
import Pagination from '@/components/Pagination';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import TableEndRecord from '@/components/ui/TableEndRecord';
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
import { useSearchParams } from 'next/navigation';
import React from 'react';
import PaymentItem from './PaymentItem';

export enum RetrievalType {
  RECENT = 'recent',
  ALL = 'all',
}
interface PaymentListProps {
  retrieve?: RetrievalType;
}
const PaymentList = ({ retrieve = RetrievalType.RECENT }: PaymentListProps) => {
  const searchParams = useSearchParams();
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

  if (loading) return <LoadingSkeleton />;

  const noFoundText =
    !searchParams.has('page') || searchParams.has('q')
      ? 'No record found.'
      : undefined;

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
            searchPlaceholder='Search payments'
            showPeriod={false}
            showSearch={true}
            handleFilterByDateSubmit={handleFilterByDateSubmit}
            handleRefresh={handleRefresh}
            handleSearchSubmit={handleSearchSubmit}
          />
        )}

        <div className='overflow-x-auto rounded-xl shadow-md border border-gray-200 dark:border-gray-700'>
          <table className='w-full text-sm text-left text-gray-700 dark:text-gray-200'>
            <thead className='text-xs uppercase bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'>
              <tr>
                {[
                  'Date',
                  'Transaction ID',
                  'Type',
                  'User',
                  'Amount',
                  'Status',
                ].map((heading) => (
                  <th key={heading} className='px-6 py-3 whitespace-nowrap'>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className='text-sm'>
              {payments.map((txn, idx) => (
                <PaymentItem txn={txn} idx={idx} />
              ))}
              {!payments.length && (
                <TableEndRecord colspan={10} text={noFoundText} />
              )}
            </tbody>
          </table>
        </div>

        {retrieve === RetrievalType.ALL && (
          <Pagination
            noMoreNextPage={payments.length === 0}
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
