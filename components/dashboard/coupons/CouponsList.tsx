'use client';

import React from 'react';
import Pagination from '@/components/Pagination';
import TableEndRecord from '@/components/ui/TableEndRecord';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { useSearchParams } from 'next/navigation';
import { Coupon } from '@/types/coupon';
import CouponItem from './CouponItem';

interface CouponListProps {
  coupons: Coupon[];
  count: number;
  onClickNext: () => Promise<void>;
  onClickPrev: () => Promise<void>;
  currentPage: number;
  loading: boolean;
}
const CouponsList = ({
  coupons,
  count,
  onClickNext,
  onClickPrev,
  currentPage,
  loading,
}: CouponListProps) => {
  const searchParams = useSearchParams();
  if (loading) return <LoadingSkeleton />;

  const noFoundText =
    !searchParams.has('page') || searchParams.has('q')
      ? 'No record found.'
      : undefined;

  return (
    <>
      <div className='overflow-x-auto rounded-xl shadow-md border border-gray-200 dark:border-gray-700'>
        <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th scope='col' className='px-6 py-3'>
                Code
              </th>
              <th scope='col' className='px-6 py-3'>
                Created By
              </th>
              <th scope='col' className='px-6 py-3'>
                Type
              </th>
              <th scope='col' className='px-6 py-3'>
                Value
              </th>
              <th scope='col' className='px-6 py-3'>
                Start/end date
              </th>
              <th scope='col' className='px-6 py-3'>
                Usage Limit
              </th>
              <th scope='col' className='px-6 py-3'>
                User Limit
              </th>
              <th scope='col' className='px-6 py-3'>
                Minimum Purchase
              </th>
              <th scope='col' className='px-6 py-3'>
                Status
              </th>
              <th scope='col' className='px-6 py-3'>
                Date Created
              </th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <CouponItem coupon={coupon} />
            ))}

            {!coupons.length && (
              <TableEndRecord colspan={8} text={noFoundText} />
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <Pagination
        total={count}
        currentPage={currentPage}
        onClickNext={onClickNext}
        onClickPrev={onClickPrev}
        noMoreNextPage={coupons.length === 0}
      />
    </>
  );
};

export default CouponsList;
