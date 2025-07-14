'use client';

import CreateSubscriptionPlanForm from '@/components/dashboard/product/subscriptions/AddSubscriptionPlanForm';
import SubscriptionPlansList from '@/components/dashboard/product/subscriptions/SubscriptionPlansList';
import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import React, { useState } from 'react';

const Subscription = () => {
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Subscriptions'
          brief='Create and manage your subscriptions with ease'
          enableBreadCrumb={true}
          layer2='Products'
          layer2Link='/products'
          layer3='Subscriptions'
          ctaButtons={
            <div className='flex-shrink-0 self-start'>
              <Button
                variant='primary'
                className=' text-md flex p-2 px-4 gap-2'
                onClick={() => setIsPlanModalOpen(true)}
              >
                <Icon url='/icons/landing/plus.svg' /> Add Plan
              </Button>
            </div>
          }
        />

        <SubscriptionPlansList />

        {/* Invite Modal */}
        <Modal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          title='Create plan'
          className='max-w-xl my-[50%] overflow-y-auto'
        >
          <CreateSubscriptionPlanForm setIsPlanModalOpen={setIsPlanModalOpen} />
        </Modal>
      </div>
    </main>
  );
};

export default Subscription;
