'use client';

import Pagination from '@/components/Pagination';
import SectionHeading from '@/components/SectionHeading';
import Filter from '@/components/Filter';
import {
  NotificationType,
  NOTIFICATION_STATUS,
  pushNotificationData,
  replaceAsterisk,
  systemPushData,
  NotificationKind,
} from '@/lib/utils';
import React, { useState } from 'react';
import ActionDropdown from '../../ActionDropdown';

const SystemNotificationSection = () => {
  const [notificationType, setNotificationType] = useState(
    NotificationKind.IMMEDIATE
  );

  return (
    <>
      <header className='multiple-section-container'>
        {/* Page Heading */}
        <SectionHeading title='In-App Push Notifications' />

        {/* Filter */}
        <Filter />
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

                  <th scope='col' className='px-6 py-3'></th>
                </tr>
              </thead>
              <tbody>
                {systemPushData.map((notificationItem) => (
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

                    <td className='flex px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
                      {/* <ActionDropdown
                        id={notificationItem.id}
                        status={NOTIFICATION_STATUS.NONE}
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

export default SystemNotificationSection;
