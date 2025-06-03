import AddSubscriptionPlanForm from '@/components/dashboard/product/subscriptions/AddSubscriptionPlanForm';
import PageHeading from '@/components/PageHeading';
import React from 'react';

const AddSubscription = () => {
  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container-pt-0 space-y-3 pb-2'>
        <PageHeading
          title='Add Subscription'
          enableBreadCrumb={true}
          layer2='Products'
          layer3='Subscriptions'
          layer4='Add Subscription'
          layer3Link='/products/subscriptions'
          // enableBackButton={true}
        />

        <section></section>
      </div>
    </main>
  );
};

export default AddSubscription;
