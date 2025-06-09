import PageHeading from '@/components/PageHeading';
import React from 'react';

const Customer = () => {
  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container space-y-6'>
        {/* Page Heading */}
        <PageHeading
          title='Customer Details'
          brief='Manage your customer'
          enableBreadCrumb
          layer2='Customer'
          layer3='Customer Details'
          layer2Link='/customers'
          enableBackButton
        />
      </div>
    </main>
  );
};

export default Customer;
