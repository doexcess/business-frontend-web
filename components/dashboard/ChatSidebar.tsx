'use client';
import React from 'react';
import { Card } from './Card';

const ChatSidebar = () => {
  return (
    <Card className='w-[35%] h-full bg-neutral-2 p-4 flex flex-col rounded-lg'>
      {/* Header tabs */}
      <div className='flex space-x-4 mb-6'>
        <button className='flex-1 text-sm font-medium text-white bg-primary-main py-2 rounded-lg'>
          All Chats
        </button>
        <button className='flex-1 text-sm py-2'>Unread</button>
      </div>

      {/* Search bar */}
      <div className='relative mb-6'>
        <input
          type='text'
          placeholder='Search'
          className='w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500'
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

      {/* Empty state */}
      <div className='flex-1 flex flex-col items-center justify-center text-center'>
        <div className='w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3'>
          <svg
            className='w-6 h-6 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
            />
          </svg>
        </div>
        <p className='text-sm text-gray-500 mb-1'>No chats</p>
        <p className='text-xs text-gray-400 mb-6'>
          You have not started any conversation
        </p>
      </div>
    </Card>
  );
};

export default ChatSidebar;
