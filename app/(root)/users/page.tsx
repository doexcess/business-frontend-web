import ClientMgtTable from '@/components/dashboard/ClientMgtTable';
import ClientTableFilters from '@/components/dashboard/ClientTableFilters';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import React from 'react';

const Users = () => {
  return (
    <main className='section-container'>
      <div className='h-full space-y-3'>
        {/* Main Content */}
        <div className='flex-1 text-black-1 dark:text-white mb-3'>
          <header className='flex flex-col md:flex-row justify-between md:items-center gap-2 md:gap-0'>
            <div>
              <h2 className='text-2xl font-semibold'>Client Management</h2>
              <p className='text-muted'>
                Monitor your business growth and engagement trends overtime
              </p>
            </div>
            <div className='flex gap-2'>
              <Button
                variant={'primary'}
                className='text-lg py-1 md:py-2 flex gap-2'
              >
                <Icon url='/icons/clients/download-all.svg' />
                Download All
              </Button>
            </div>
          </header>
        </div>

        <ClientTableFilters />

        <ClientMgtTable />
      </div>
    </main>
  );
};

export default Users;
