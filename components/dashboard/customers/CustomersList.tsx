'use client';

import Pagination from '@/components/Pagination';
import TableEndRecord from '@/components/ui/TableEndRecord';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { useSearchParams } from 'next/navigation';
import Filter from '@/components/Filter';
import useCustomers from '@/hooks/page/useCustomers';
import CustomerItem from './CustomerItem';
import { Button } from '@/components/ui/Button';
import { Download, Upload } from 'lucide-react';

const CustomersList = () => {
  const searchParams = useSearchParams();

  const {
    customers,
    customersLoading: loading,
    count,
    currentPage,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  } = useCustomers();

  if (loading) return <LoadingSkeleton />;

  const noFoundText =
    !searchParams.has('page') || searchParams.has('q')
      ? 'No record found.'
      : undefined;

  return (
    <>
      <section>
        <Filter
          searchPlaceholder='Search customers'
          showPeriod={false}
          showSearch={true}
          handleFilterByDateSubmit={handleFilterByDateSubmit}
          handleRefresh={handleRefresh}
          handleSearchSubmit={handleSearchSubmit}
          extra={
            <>
              <div className='flex items-center m-0 flex-shrink-0 self-start gap-2'>
                <Button
                  size='icon'
                  variant='primary'
                  className='text-md text-md flex p-2 px-2 gap-2'
                  title='Download'
                >
                  <Download size={18} />
                </Button>
                <Button
                  size='icon'
                  variant='primary'
                  className='text-md text-md flex p-2 gap-2'
                >
                  <Upload size={18} />
                </Button>
              </div>
            </>
          }
        />

        <div className='overflow-x-auto rounded-xl shadow-md border border-gray-200 dark:border-gray-700'>
          <table className='w-full text-sm text-left text-gray-700 dark:text-gray-200'>
            <thead className='text-xs uppercase bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'>
              <tr>
                {[
                  'ID',
                  'Name',
                  'Email',
                  'Phone Number',
                  'Total Expense(s)',
                  'Date Created',
                  'Date Updated',
                ].map((heading) => (
                  <th key={heading} className='px-6 py-3 whitespace-nowrap'>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='text-sm'>
              {customers.map((customer) => (
                <CustomerItem customer={customer} />
              ))}

              {!customers.length && (
                <TableEndRecord colspan={8} text={noFoundText} />
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          total={count}
          currentPage={currentPage}
          onClickNext={onClickNext}
          onClickPrev={onClickPrev}
          noMoreNextPage={customers.length === 0}
        />
      </section>
    </>
  );
};

export default CustomersList;
