'use client';

import Pagination from '@/components/Pagination';
import SectionHeading from '@/components/SectionHeading';
import Badge from '@/components/ui/SystemBadge';
import Filter from '@/components/Filter';
import {
  getColor,
  NotificationType,
  NOTIFICATION_STATUS,
  pushNotificationData,
  replaceAsterisk,
  NotificationKind,
} from '@/lib/utils';
import { capitalize } from 'lodash';
import Link from 'next/link';
import React, { useState } from 'react';
import { HiPlus } from 'react-icons/hi';
import ActionDropdown from '../../ActionDropdown';
import NotificationStatus from '../../Status';

const JobsNotificationSection = () => {
  const [notificationType, setNotificationType] = useState(
    NotificationKind.IMMEDIATE
  );

  return (
    <>
      <header className='multiple-section-container'>
        {/* Page Heading */}
        <SectionHeading title='Push Notifications' />

        {/* Filter */}
        <Filter
          extra={
            <>
              <NotificationStatus
                setNotificationType={setNotificationType}
                notificationType={notificationType}
              />
              <Link
                href={`/notifications/push/create?type=${notificationType}`}
                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center gap-1'
              >
                {' '}
                <HiPlus />
                Create
              </Link>
            </>
          }
        />
      </header>
      <section className='section-container-padding-0'>
        <div className='overflow-x-auto rounded-none'>
          <div className='relative overflow-x-auto'>
            <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 min-w-full divide-y '>
                <tr>
                  <th scope='col' className='px-6 py-3'>
                    Title
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Body
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Network
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Status
                  </th>

                  <th scope='col' className='px-6 py-3'></th>
                </tr>
              </thead>
              <tbody>
                {pushNotificationData.map((notificationItem) => (
                  <tr
                    key={notificationItem.id}
                    className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
                  >
                    <td className='px-6 py-4 max-w-sm whitespace-nowrap overflow-hidden text-ellipsis text-gray-900 dark:text-white font-bold'>
                      {notificationItem.title}
                    </td>
                    <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
                      {notificationItem.body}
                    </td>
                    <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
                      {replaceAsterisk(notificationItem.network)}
                    </td>

                    <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
                      <Badge
                        color={getColor(notificationItem.status)!}
                        text={capitalize(notificationItem.status)}
                      />
                    </td>

                    <td className='flex px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
                      {/* <ActionDropdown
                        id={notificationItem.id}
                        status={notificationItem.status as NOTIFICATION_STATUS}
                        notificationType={notificationType}
                        table='push'
                      /> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <Pagination total={pushNotificationData.length} />
          </div>
        </div>
      </section>
    </>
  );
};

export default JobsNotificationSection;
