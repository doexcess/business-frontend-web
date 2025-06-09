import CustomersList from '@/components/dashboard/customers/CustomersList';
import PageHeading from '@/components/PageHeading';
import React from 'react';

const Customers = () => {
  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container space-y-6'>
        {/* Header */}
        <PageHeading
          title='Client Management'
          brief='Monitor your business growth and engagement trends overtime'
          enableBreadCrumb={true}
          layer2='Client Management'
          // ctaButtons={
          //   <div className='flex-shrink-0 self-start'>
          //     <Button className='text-md bg-primary text-md flex p-2 px-4 gap-2'>
          //       <Icon url='/icons/clients/download-all.svg' />
          //       Download All
          //     </Button>
          //   </div>
          // }
        />

        <CustomersList />

        {/* <ClientMgtTable /> */}
      </div>
    </main>
  );
};

export default Customers;
