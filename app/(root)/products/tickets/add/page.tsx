'use client';

import { Suspense } from 'react';
import PageHeading from '@/components/PageHeading';
import AddTicketForm from '@/components/dashboard/product/ticket/AddTicketForm';
import { BreadcrumbLayer } from '@/components/PageHeading';

const BREADCRUMB_LAYERS: BreadcrumbLayer[] = [
  {
    title: 'Products',
    href: '/products',
  },
  {
    title: 'Tickets',
    href: '/products/tickets',
  },
  {
    title: 'Add Ticket',
    href: '/products/tickets/add',
  },
];

const AddTicket = () => {
  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Add Ticket'
          enableBreadCrumb={true}
          layer2={BREADCRUMB_LAYERS[0].title}
          layer3={BREADCRUMB_LAYERS[1].title}
          layer4={BREADCRUMB_LAYERS[2].title}
          layer3Link={BREADCRUMB_LAYERS[1].href}
          enableBackButton={true}
        />

        <Suspense fallback={<div>Loading...</div>}>
          <div className='mt-6'>
            <AddTicketForm />
          </div>
        </Suspense>
      </div>
    </main>
  );
};

export default AddTicket;
