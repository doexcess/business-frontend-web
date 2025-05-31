import Badge from '@/components/ui/SystemBadge';
import {
  getColor,
  NOTIFICATION_STATUS,
  NotificationKind,
  shortenId,
} from '@/lib/utils';
import { InstantNotification } from '@/types/notification';
import { capitalize } from 'lodash';
import React, { useState } from 'react';
import ActionDropdown from '../../ActionDropdown';
import moment from 'moment-timezone';
import Link from 'next/link';
import Image from 'next/image';

interface InstantNotificationItemProps {
  notification: InstantNotification;
}
const InstantNotificationItem = ({
  notification,
}: InstantNotificationItemProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const sender = notification.owner
    ? `${notification.owner?.name} (${shortenId(notification.owner?.id!)})`
    : notification.business
    ? `${notification.business?.business_name} (${shortenId(
        notification.business?.id!
      )})`
    : 'N/A';

  const status = notification.status
    ? NOTIFICATION_STATUS.DELIVERED
    : NOTIFICATION_STATUS.FAILED;

  return (
    <tr
      key={notification.id}
      className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
    >
      <td className='px-6 py-4 max-w-sm whitespace-nowrap overflow-hidden text-ellipsis text-gray-900 dark:text-white font-bold'>
        <button
          className='hover:text-primary-400'
          onClick={() => setIsDrawerOpen(true)}
          title={notification.id}
        >
          {notification.title}
        </button>
      </td>
      <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
        {sender}
      </td>
      <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
        <Badge color={getColor(status)!} text={capitalize(status)} />
      </td>
      <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
        {moment(notification.created_at).format('MMMM D, YYYY')}
      </td>

      <td className='flex px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
        <ActionDropdown
          id={notification.id}
          status={status}
          notificationType={notification.type}
        />
      </td>
    </tr>
  );
};

export default InstantNotificationItem;
