'use client';

import React from 'react';
import { Card } from '../Card';
import Input from '../../ui/Input';
import Icon from '../../ui/Icon';
import MessageList from './MessageList';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const ChatSidebar = () => {
  const pathname = usePathname();

  return (
    <Card
      className={cn(
        'w-full md:w-[35%] h-full bg-neutral-2 p-4 flex-col rounded-lg',
        pathname === '/messages' ? 'flex' : 'hidden md:flex'
      )}
    >
      {/* Header tabs */}
      <div className='flex space-x-4 mb-6'>
        <button className='flex-1 text-sm font-bold text-white bg-primary-main py-2 rounded-lg'>
          All Chats
        </button>
        <button className='flex-1 text-sm font-bold py-2'>Unread</button>
      </div>

      {/* Search bar */}
      <div className='relative mb-6'>
        <Input
          type='text'
          placeholder='Search'
          name='search'
          className='w-full pl-8 pr-3 py-2 text-sm border rounded-md dark:border-black-2 focus:outline-none focus:ring-1 focus:ring-blue-500'
        />
        <svg
          className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
          />
        </svg>
      </div>

      {[1].length === 0 ? (
        <>
          {/* Empty state */}
          <div className='flex-1 flex flex-col items-center justify-center text-center'>
            <Icon url='/icons/chat/chats.svg' width={40} height={40} />

            <p className='mb-1 font-bold'>No chats</p>
            <p className='text-sm mb-6'>
              You have not started any conversation
            </p>
          </div>
        </>
      ) : (
        <main>
          <MessageList />
        </main>
      )}
    </Card>
  );
};

export default ChatSidebar;
