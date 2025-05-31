'use client';

import React, { useState } from 'react';
import PageHeading from '@/components/PageHeading';
import Filter from '@/components/Filter';
import NotificationStatus from '@/components/dashboard/notifications/Status';
import Link from 'next/link';
import { HiPlus } from 'react-icons/hi';
import { NotificationKind } from '@/lib/utils';
import useNotification from '@/hooks/page/useInstantNotification';
import { useSearchParams } from 'next/navigation';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import InstantNotificationsList from '@/components/dashboard/notifications/email/instant/InstantNotificationsList';

const InstantEmailNotification = () => {
  const [notificationType, setNotificationType] = useState(
    NotificationKind.IMMEDIATE
  );

  const {
    instantNotifications,
    instantNotificationLoading,
    totalInstantNotifications,
    onClickNext,
    onClickPrev,
    currentPage,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  } = useNotification();

  return (
    <main>
      <header className='section-container'>
        {/* Page Heading */}
        <PageHeading
          title='Instant Notifications'
          enableBreadCrumb={true}
          layer2='Notifications'
          layer3='Email'
          layer4='Instant'
          layer3Link='/notifications/email'
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
                href={`/notifications/email/compose?type=${notificationType}`}
                className='text-white bg-primary-main hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-main dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center gap-1'
              >
                {' '}
                <HiPlus />
                Compose
              </Link>
            </>
          }
        />
      </header>
      <section className='section-container-padding-0'>
        <InstantNotificationsList
          notifications={instantNotifications}
          count={totalInstantNotifications}
          onClickNext={onClickNext}
          onClickPrev={onClickPrev}
          currentPage={currentPage}
          loading={instantNotificationLoading}
        />
      </section>
    </main>
  );
};

export default InstantEmailNotification;
