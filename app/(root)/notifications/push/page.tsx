'use client';

import React from 'react';
import PageHeading from '@/components/PageHeading';
import JobsNotificationSection from '@/components/notifications/push/jobs/JobsNotificationSection';
import SystemNotificationSection from '@/components/notifications/push/system/SystemNotificationSection';

const PushNotification = () => {
  return (
    <main>
      <header className='section-container'>
        {/* Page Heading */}
        <PageHeading
          enableBreadCrumb={true}
          layer2='Notifications'
          layer3='Push'
        />
      </header>

      <div className='flex flex-col gap-6'>
        <section>
          <JobsNotificationSection />
        </section>

        <section>
          <SystemNotificationSection />
        </section>
      </div>
    </main>
  );
};

export default PushNotification;
