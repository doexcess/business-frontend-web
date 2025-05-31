import { formatMoney, PaymentStatus, shortenId } from '@/lib/utils';
import React, { useState } from 'react';
import { Drawer } from '@/components/ui/drawer'; // Import a drawer component

import moment from 'moment'; // Import moment.js

import Link from 'next/link';
import { SubscriptionPlan } from '@/types/subscription-plan';
import { capitalize } from 'lodash';
import { useParams } from 'next/navigation';
import { VerifiedIcon } from 'lucide-react';

interface SubscriptionPlanItemProps {
  subscription_plan: SubscriptionPlan;
}
const SubscriptionPlanItem = ({
  subscription_plan,
}: SubscriptionPlanItemProps) => {
  let pricing = subscription_plan.subscription_plan_prices.length
    ? subscription_plan.subscription_plan_prices.map((plan_price) => (
        <li>
          {capitalize(plan_price.period)} -{' '}
          {formatMoney(+plan_price.price, plan_price.currency)}
        </li>
      ))
    : 'N/A';

  let roles = subscription_plan.subscription_plan_roles.length
    ? subscription_plan.subscription_plan_roles.map((plan_role) => (
        <li className='flex gap-1 items-center'>
          {capitalize(plan_role.title)}{' '}
          {plan_role.selected && (
            <VerifiedIcon className='text-green-400' size={17} />
          )}
        </li>
      ))
    : 'N/A';

  return (
    <>
      <tr
        key={subscription_plan.id}
        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
      >
        <td
          scope='row'
          className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold relative group'
        >
          <Link
            href={`/products/subscriptions/${subscription_plan.id}/edit`}
            className='hover:text-primary-400'
            title={subscription_plan.id}
          >
            {shortenId(subscription_plan.id)}
          </Link>
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {subscription_plan.name}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {subscription_plan.creator.name}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {pricing}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {roles}
        </td>

        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white'>
          {moment(subscription_plan.created_at).format('MMM D, YYYY')}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white'>
          {moment(subscription_plan.updated_at).format('MMM D, YYYY')}
        </td>
      </tr>
    </>
  );
};

export default SubscriptionPlanItem;
