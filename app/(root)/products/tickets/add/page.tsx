'use client';

import React from 'react';
import PageHeading from '@/components/PageHeading';

import AddTicketForm from '@/components/dashboard/product/ticket/AddTicketForm';

const AddTicket = () => {
  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Add Ticket'
          enableBreadCrumb={true}
          layer2='Products'
          layer3='Tickets'
          layer4='Add Ticket'
          layer3Link='/products/tickets'
          enableBackButton={true}
        />

        <AddTicketForm />
      </div>
    </main>
  );
};

export default AddTicket;
