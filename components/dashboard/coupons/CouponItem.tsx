import { CouponType, formatMoney } from '@/lib/utils';
import React, { useState } from 'react';
import { Drawer } from '@/components/ui/drawer'; // Import a drawer component

import moment from 'moment'; // Import moment.js
import Link from 'next/link';
import { Coupon } from '@/types/coupon';
import { useParams } from 'next/navigation';

interface CouponItemProps {
  coupon: Coupon;
}
const CouponItem = ({ coupon }: CouponItemProps) => {
  const params = useParams();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const priceData =
    coupon.type === CouponType.FLAT
      ? formatMoney(+coupon.value, coupon.currency)
      : coupon.value;

  let statusColor = '';

  if (!coupon.is_active) {
    statusColor = `bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
  } else {
    statusColor = `bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
  }

  const createdBy = params?.id ? (
    coupon.creator.name
  ) : (
    <>
      {' '}
      <b>{coupon.creator.name}</b> from{' '}
      <Link
        href={`/organizations/${coupon.business.id}/details`}
        className='font-bold hover:text-primary-400'
      >
        {coupon.business.business_name}
      </Link>
    </>
  );

  return (
    <>
      <tr
        key={coupon.id}
        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
      >
        <td
          scope='row'
          className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold relative group'
        >
          <button
            className='hover:text-primary-400'
            onClick={() => setIsDrawerOpen(true)}
            title={coupon.id}
          >
            {coupon.code}
          </button>
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {createdBy}
        </td>

        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {coupon.type}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {priceData}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {moment(coupon.start_date).format('MMM D, YYYY')} -{' '}
          {moment(coupon.end_date).format('MMM D, YYYY')}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {coupon.usage_limit}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {coupon.user_limit}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {formatMoney(+coupon.min_purchase, coupon.currency)}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          <span
            className={`${statusColor} text-xs font-medium px-2.5 py-0.5 rounded`}
          >
            {coupon.is_active ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white'>
          {moment(coupon.created_at).format('MMM D, YYYY')}
        </td>
      </tr>

      {/* Coupon Details Drawer */}
      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <section
          className='space-y-4 text-gray-900
dark:text-white'
        >
          <h2 className='text-lg font-bold'>{coupon.code}</h2>

          <div className='space-y-2'>
            <p>
              <strong>Created by:</strong> {coupon.creator.name}
            </p>
            <p>
              <strong>Organization:</strong> {coupon.business.business_name}
            </p>
            <p>
              <strong>Type:</strong> {coupon.type}
            </p>
            <p>
              <strong>Value:</strong> {priceData}
            </p>
            <p>
              <strong>Start/end date:</strong> {coupon.type}
            </p>
            <p>
              <strong>Usage Limit:</strong>
              {coupon.usage_limit}
            </p>
            <p>
              <strong>User Limit:</strong>
              {coupon.user_limit}
            </p>
            <p>
              <strong>Minimum Purchase:</strong>
              {formatMoney(coupon.min_purchase, coupon.currency)}
            </p>
            <p>
              <strong>Status:</strong>
              <span
                className={`${statusColor} text-xs font-medium px-2.5 py-0.5 rounded`}
              >
                {coupon.is_active ? 'Active' : 'Inactive'}
              </span>
            </p>

            <p>
              <strong>Creation Date:</strong>{' '}
              {moment(coupon.created_at).format('MMMM D, YYYY')}
            </p>
          </div>

          {!params.id && (
            <div>
              <Link
                href={`/organizations/${coupon.business.id}/details`}
                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
              >
                View business
              </Link>
            </div>
          )}
        </section>
      </Drawer>
    </>
  );
};

export default CouponItem;
