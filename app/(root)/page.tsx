'use client';

import { Card } from '@/components/dashboard/Card';
import { ClientRequestsTable } from '@/components/dashboard/ClientRequestsTable';
import { LineChart } from '@/components/dashboard/LineChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { PurchaseItemType } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

const Home = () => {
  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
      {
        label: 'Events',
        data: [120, 190, 300, 458],
        borderColor: '#4f46e5',
        backgroundColor: '#4f46e5',
      },
      {
        label: 'Courses',
        data: [80, 150, 200, 120],
        borderColor: '#10b981',
        backgroundColor: '#10b981',
      },
    ],
  };

  const recentActivities = [
    {
      id: 1,
      title: 'Subscription renewal processed for Jane Smith',
      time: '2 hours ago',
      icon: '🔄',
      type: PurchaseItemType.SUBSCRIPTION,
    },
    {
      id: 2,
      title: "Event 'Business Leadership' reached 50 registrations",
      time: '3 hours ago',
      icon: '🎯',
      type: PurchaseItemType.TICKET,
    },
    {
      id: 3,
      title: 'Subscription expired for John Suit',
      time: 'Yesterday',
      icon: '⚠️',
      type: PurchaseItemType.SUBSCRIPTION,
    },
    {
      id: 4,
      title: "Course 'Digital Marketing Essentials' received 5-star rating",
      time: '4:30 PM - 5:30 PM',
      icon: '⭐',
      type: PurchaseItemType.COURSE,
    },
  ];

  const clientRequests = [
    {
      id: '0001',
      name: 'Chinedu Okafor',
      date: '13 Mar 2025',
      content: 'Event',
      status: 'Completed',
    },
    // Add more requests as needed
  ];

  return (
    <main className='section-container'>
      <div className='h-full'>
        {/* Main Content */}
        <div className='flex-1 text-black-1 dark:text-white'>
          <header className='flex flex-col md:flex-row justify-between md:items-center'>
            <h2 className='text-2xl font-semibold'>Hello, John 👋🏼</h2>
            <div className='flex gap-2'>
              <Button
                variant={'primary'}
                size={'icon'}
                className='hover:bg-primary-800'
              >
                <Icon url='/icons/landing/plus.svg' />
              </Button>
              <Button
                variant={'outline'}
                className='text-lg border-primary-main text-primary-main py-1 dark:text-white hover:bg-primary-800 hover:text-white'
              >
                Schedule Message
              </Button>
            </div>
          </header>

          {/* Stats */}
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6'>
            {[
              {
                label: 'Total Revenue',
                value: '₦200',
                change: '',
                icon: <Icon url='/icons/landing/download.svg' />,
              },
              {
                label: 'Active Subscriptions',
                value: '500',
                change: '',
                icon: <Icon url='/icons/landing/terminal.svg' />,
              },
              {
                label: 'All Clients',
                value: '900',
                change: '',
                icon: <Icon url='/icons/landing/users.svg' />,
              },
              {
                label: 'Course Completions',
                value: '50',
                change: '',
                icon: <Icon url='/icons/landing/book-open.svg' />,
              },
            ].map((stat, index) => (
              <div
                key={index}
                className='bg-white dark:bg-gray-800 p-4 rounded-md space-y-3 border border-neutral-3 dark:border-black-2'
              >
                <div className='flex gap-1'>
                  {stat.icon}
                  <h3 className='text-gray-600 dark:text-white'>
                    {stat.label}
                  </h3>
                </div>
                {/* {metricsLoading ? (
                  <Shimmer className='w-3/4 h-6 mt-2' />
                ) : ( */}
                <div className='flex gap-2 items-center'>
                  <p className='text-xl font-bold'>{stat.value}</p>
                  <span
                    className={
                      stat.change.includes('-')
                        ? 'text-red-500'
                        : 'text-green-500'
                    }
                  >
                    {stat.change}
                  </span>
                </div>
                {/* )} */}
              </div>
            ))}
          </div>

          <div className='py-6 space-y-6'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Performance Chart */}
              <Card className='lg:col-span-2'>
                <div className='flex flex-col md:flex-row justify-between md:items-center mb-4'>
                  <div>
                    <h1 className='text-2xl font-bold '>Performance Trends</h1>
                    <p className=''>
                      Monitor your business growth and engagement trends over
                      time.
                    </p>
                  </div>

                  <div className='flex items-center gap-2'>
                    <select className='bg-gray-50 dark:bg-gray-800 border border-gray-300 text-gray-900 dark:text-gray-300 dark:border-gray-400 text-sm rounded-lg px-3'>
                      <option>2025</option>
                      <option>2024</option>
                    </select>
                    <Button
                      variant='outline'
                      size={'icon'}
                      className='py-1 bg-gray-50  dark:bg-gray-800 border border-gray-300 dark:border-gray-400'
                    >
                      <Icon url='/icons/landing/refresh.svg' />
                    </Button>
                    <Button
                      variant='outline'
                      size={'icon'}
                      className='py-1 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-400'
                    >
                      <Icon url='/icons/landing/elipsis.svg' />
                    </Button>
                  </div>
                </div>
                <LineChart data={performanceData} />
              </Card>

              {/* Recent Activity */}
              <Card className='flex flex-col justify-between gap-2'>
                <div>
                  <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-lg font-semibold'>Recent Activity</h2>
                    <Link href='' className='text-primary-main dark:text-white'>
                      View All
                    </Link>
                  </div>
                  <RecentActivity activities={recentActivities} />
                </div>
                <button className='px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition w-full'>
                  Create an Event
                </button>
              </Card>
            </div>

            <div className='grid grid-cols-1  gap-6'>
              {/* Client Requests */}
              <div className='lg:col-span-2'>
                <div className='flex justify-between items-center mb-3'>
                  <h2 className='text-lg font-semibold'>Client Requests</h2>
                  <Link href='' className='text-primary-main dark:text-white'>
                    View All
                  </Link>
                </div>
                <ClientRequestsTable requests={clientRequests} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
