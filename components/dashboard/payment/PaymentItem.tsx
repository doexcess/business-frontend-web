import TableEndRecord from '@/components/ui/TableEndRecord';
import {
  cn,
  formatMoney,
  getAvatar,
  PaymentStatus,
  shortenId,
} from '@/lib/utils';
import { Payment } from '@/types/payment';
import { EyeIcon, PencilIcon } from 'lucide-react';
import moment from 'moment-timezone';
import Link from 'next/link';
import React from 'react';

interface PaymentItemProps {
  txn: Payment;
  idx: number;
}
const PaymentItem = ({ txn, idx }: PaymentItemProps) => {
  const isEvenRow = idx % 2 === 0;
  const rowClasses = cn(
    'border-b dark:border-gray-700',
    isEvenRow ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'
  );

  const user = txn.user;
  const profilePic = user?.profile?.profile_picture;
  const displayAvatar = profilePic || user?.name;

  return (
    <>
      <tr key={txn.id} className={rowClasses}>
        {/* Date */}
        <td className='px-6 py-2 min-w-[140px] text-sm'>
          {moment(txn.created_at).format('LL')}
        </td>

        {/* Transaction ID */}
        <td className='px-6 py-2'>
          <Link
            href={`/payments/${txn.id}/details`}
            className='hover:underline font-medium flex items-center gap-1 underline-offset'
          >
            {shortenId(txn.id)}
            <PencilIcon size='13' />
          </Link>
        </td>

        {/* Type */}
        <td className='px-6 py-2'>{txn.purchase_type}</td>

        {/* User */}
        <td className='px-6 py-2 min-w-[200px]'>
          <Link
            href={`/customers/${user.id}`}
            className='flex items-center gap-3 underline-offset'
          >
            {displayAvatar && (
              <img
                src={getAvatar(profilePic!, user?.name)}
                alt={user?.name}
                className='w-10 h-10 rounded-full object-cover'
              />
            )}

            <span className='font-semibold truncate text-gray-800 dark:text-gray-100 gap-1 flex items-center'>
              {user?.name || '-'}
              <EyeIcon size='13' />
            </span>
          </Link>
        </td>

        {/* Amount */}
        <td className='px-6 py-2 font-medium'>
          {formatMoney(+txn.amount, txn.currency)}
        </td>

        {/* Status */}
        <td className='px-6 py-2'>
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
    </>
  );
};

export default PaymentItem;
