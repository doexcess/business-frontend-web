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

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container'>
        {/* Page Heading */}
        <PageHeading
          title='Instant Notifications'
          brief='Track your email notifications'
          enableBreadCrumb={true}
          layer2='Notifications'
          layer3='Email'
          layer4='Instant'
          layer3Link='/notifications/email'
          enableBackButton={true}
        />

        <InstantNotificationsList />
      </div>
    </main>
  );
};

export default InstantEmailNotification;
