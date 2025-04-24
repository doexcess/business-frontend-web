import React from 'react';
import { Dropdown, Button, Avatar, Badge } from 'flowbite-react';
import { HiBell } from 'react-icons/hi';
import { HiChevronDown } from 'react-icons/hi';

const RecentNotifications = () => {
  return (
    <>
      <Dropdown
        inline
        label={
          <HiBell className='w-10 h-10 p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600' />
        }
        arrowIcon={false}
        className='w-100 max-w-sm bg-white divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600 shadow-lg rounded-xl overflow-hidden'
      >
        <Dropdown.Header className='text-center text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-600 font-medium'>
          Notifications
        </Dropdown.Header>

        <Dropdown.Item
          href='#'
          className='flex items-start border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600'
        >
          <Avatar
            img='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png'
            alt='Bonnie Green'
            className='mr-3'
          />
          <div className='flex-1'>
            <div className='text-gray-500 dark:text-gray-400 text-sm mb-1.5'>
              New message from{' '}
              <span className='font-semibold text-gray-900 dark:text-white'>
                Bonnie Green
              </span>
              : "Hey, what's up? All set for the presentation?"
            </div>
            <div className='text-xs font-medium text-primary-600 dark:text-primary-500'>
              a few moments ago
            </div>
          </div>
        </Dropdown.Item>

        <Dropdown.Item
          href='#'
          className='flex items-start border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600'
        >
          <Avatar
            img='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png'
            alt='Jese Leos'
            className='mr-3'
          />
          <div className='flex-1'>
            <div className='text-gray-500 dark:text-gray-400 text-sm mb-1.5'>
              <span className='font-semibold text-gray-900 dark:text-white'>
                Jese Leos
              </span>{' '}
              and{' '}
              <span className='font-medium text-gray-900 dark:text-white'>
                5 others
              </span>{' '}
              started following you.
            </div>
            <div className='text-xs font-medium text-primary-600 dark:text-primary-500'>
              10 minutes ago
            </div>
          </div>
        </Dropdown.Item>

        <Dropdown.Item
          href='#'
          className='flex items-start border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600'
        >
          <Avatar
            img='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/joseph-mcfall.png'
            alt='Joseph McFall'
            className='mr-3'
          />
          <div className='flex-1'>
            <div className='text-gray-500 dark:text-gray-400 text-sm mb-1.5'>
              <span className='font-semibold text-gray-900 dark:text-white'>
                Joseph McFall
              </span>{' '}
              and{' '}
              <span className='font-medium text-gray-900 dark:text-white'>
                141 others
              </span>{' '}
              love your story. See it and view more stories.
            </div>
            <div className='text-xs font-medium text-primary-600 dark:text-primary-500'>
              44 minutes ago
            </div>
          </div>
        </Dropdown.Item>

        <Dropdown.Item
          href='#'
          className='flex items-start border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600'
        >
          <Avatar
            img='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/roberta-casas.png'
            alt='Roberta Casas'
            className='mr-3'
          />
          <div className='flex-1'>
            <div className='text-gray-500 dark:text-gray-400 text-sm mb-1.5'>
              <span className='font-semibold text-gray-900 dark:text-white'>
                Leslie Livingston
              </span>{' '}
              mentioned you in a comment:{' '}
              <span className='font-medium text-primary-600 dark:text-primary-500'>
                @bonnie.green
              </span>{' '}
              what do you say?
            </div>
            <div className='text-xs font-medium text-primary-600 dark:text-primary-500'>
              1 hour ago
            </div>
          </div>
        </Dropdown.Item>

        <Dropdown.Item
          href='#'
          className='flex items-start hover:bg-gray-100 dark:hover:bg-gray-600'
        >
          <Avatar
            img='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/robert-brown.png'
            alt='Robert Brown'
            className='mr-3'
          />
          <div className='flex-1'>
            <div className='text-gray-500 dark:text-gray-400 text-sm mb-1.5'>
              <span className='font-semibold text-gray-900 dark:text-white'>
                Robert Brown
              </span>{' '}
              posted a new video: Glassmorphism - learn how to implement the new
              design trend.
            </div>
            <div className='text-xs font-medium text-primary-600 dark:text-primary-500'>
              3 hours ago
            </div>
          </div>
        </Dropdown.Item>

        <Dropdown.Item
          href='#'
          className='block text-md font-medium text-center text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-gray-600 dark:text-white '
        >
          View all
        </Dropdown.Item>
      </Dropdown>
    </>
  );
};

export default RecentNotifications;
