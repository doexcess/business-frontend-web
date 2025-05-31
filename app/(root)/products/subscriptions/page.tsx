'use clent';

import SubscriptionPlansList from '@/components/dashboard/product/subscriptions/SubscriptionPlansList';
import PageHeading from '@/components/PageHeading';
import Icon from '@/components/ui/Icon';
import Link from 'next/link';
import React from 'react';

const Subscription = () => {
  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Subscriptions'
          brief='Create and manage your subscriptions with ease'
          enableBreadCrumb={true}
          layer2='Products'
          layer3='Subscriptions'
          ctaButtons={
            <div className='flex-shrink-0 self-start'>
              <Link
                href='/products/subscriptions/add'
                className='text-md flex gap-1 bg-primary p-2 px-4 rounded-lg'
              >
                <Icon url='/icons/landing/plus.svg' /> Add Plan
              </Link>
            </div>
          }
        />

        <SubscriptionPlansList />
      </div>
    </main>
  );
};

export default Subscription;
