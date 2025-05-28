'use client';

import PaymentList, {
  RetrievalType,
} from '@/components/dashboard/payment/PaymentList';
import PageHeading from '@/components/PageHeading';
import React from 'react';

const Payments = () => {
  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container space-y-6'>
        {/* Header */}
        <PageHeading
          title='Payments'
          enableBreadCrumb={true}
          layer2='Payments'
        />

        <PaymentList retrieve={RetrievalType.ALL} />
      </div>
    </main>
  );
};

export default Payments;
