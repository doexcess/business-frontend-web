'use client';

import React, { useState } from 'react';
import PageHeading from '@/components/PageHeading';
import Filter from '@/components/Filter';
import Link from 'next/link';
import { HiPlus } from 'react-icons/hi';
import { NotificationKind } from '@/lib/utils';
import useScheduledNotification from '@/hooks/page/useScheduledNotification';
import ScheduledNotificationsList from '@/components/dashboard/notifications/email/scheduled/ScheduledNotificationsList';

const ScheduledEmailNotification = () => {
  const [notificationType, setNotificationType] = useState(
    NotificationKind.SCHEDULED
  );

  const {
    scheduledNotifications,
    scheduledNotificationLoading,
    totalScheduledNotifications,
    onClickNext,
    onClickPrev,
    currentPage,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  } = useScheduledNotification();

  return (
    <main>
      <header className='section-container'>
        {/* Page Heading */}
        <PageHeading
          title='Scheduled Notifications'
          enableBreadCrumb={true}
          layer2='Notifications'
          layer3='Email'
          layer4='Scheduled'
          enableBackButton={true}
        />

        {/* Filter */}
        <Filter
          showPeriod={false}
          handleSearchSubmit={handleSearchSubmit}
          handleFilterByDateSubmit={handleFilterByDateSubmit}
          handleRefresh={handleRefresh}
          extra={
            <>
              <Link
                href={`/notifications/email/schedule?type=${notificationType}`}
                className='text-white bg-primary-main hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-main dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center gap-1'
              >
                {' '}
                <HiPlus />
                Schedule
              </Link>
            </>
          }
        />
      </header>
      <section className='section-container-padding-0'>
        <ScheduledNotificationsList
          notifications={scheduledNotifications}
          count={totalScheduledNotifications}
          onClickNext={onClickNext}
          onClickPrev={onClickPrev}
          currentPage={currentPage}
          loading={scheduledNotificationLoading}
        />
      </section>
    </main>
  );
};

export default ScheduledEmailNotification;
