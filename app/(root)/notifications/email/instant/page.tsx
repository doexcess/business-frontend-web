'use client';

import React, { useState } from 'react';
import PageHeading from '@/components/PageHeading';
import { NotificationKind } from '@/lib/utils';
import InstantNotificationsList from '@/components/dashboard/notifications/email/instant/InstantNotificationsList';

const InstantEmailNotification = () => {
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
