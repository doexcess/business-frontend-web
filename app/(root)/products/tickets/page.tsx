import CourseGridItem from '@/components/dashboard/course/CourseGridItem';
import Filter from '@/components/Filter';
import PageHeading from '@/components/PageHeading';
import Icon from '@/components/ui/Icon';
import Link from 'next/link';
import React from 'react';

const Tickets = () => {
  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Event Tickets'
          brief='Create and manage your event tickets with ease'
          enableBreadCrumb={true}
          layer2='Products'
          layer3='Event Tickets'
          ctaButtons={
            <div className='flex-shrink-0 self-start'>
              <Link
                href='/products/tickets/add'
                className='text-md flex gap-1 bg-primary p-2 px-4 rounded-lg'
              >
                <Icon url='/icons/landing/plus.svg' /> Add Ticket
              </Link>
            </div>
          }
        />

        {/* Search and Filter - exact replication */}
        <div className='mb-2'>
          <Filter
            pageTitle='All Event Tickets'
            pageTitleClass='text-xl'
            showPeriod={false}
            enableRightSearchBar={true}
            showFullSearchWidth={true}
          />
        </div>

        <div
          className='
          flex space-x-4 mb-6 overflow-x-auto whitespace-nowrap'
        >
          {['upcoming', 'past'].map((tab, index) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm  ${
                index === 0
                  ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                  : 'text-gray-500 dark:text-white font-medium hover:text-gray-700 dark:hover:text-gray-400'
              }`}
              // onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Course List - exact styling */}
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
            <CourseGridItem
              key={item}
              id={item.toString()}
              imageSrc='/images/course/course2.png'
              title='Design Essentials'
              price={4000}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Tickets;
