'use client';

import Image from 'next/image';
import clsx from 'clsx';
import Icon from '@/components/ui/Icon';

const messages = [
  {
    name: 'Cecilia Francis',
    message: 'Can I reschedule my onboarding sess...',
    time: '1hr',
    unreadCount: 2,
    avatar: '/icons/chat/avatars/image1.png',
    isActive: false,
    isRead: false,
  },
  {
    name: 'Uchenna Anyaoku',
    message: "I'd like to upgrade to the Enterprise Plan",
    time: '1hr',
    unreadCount: 0,
    avatar: '/icons/chat/avatars/image2.png',
    isActive: false,
    isRead: false,
  },
  {
    name: 'Edith Johnson',
    message: 'Start the transaction',
    time: '1hr',
    unreadCount: 0,
    avatar: '/icons/chat/avatars/image3.png',
    isActive: true,
    isRead: true,
  },
  {
    name: 'Adeola Bankole',
    message: "I'm having trouble uploading my course",
    time: '1hr',
    unreadCount: 5,
    avatar: '/icons/chat/avatars/image4.png',
    isActive: false,
    isRead: false,
  },
  {
    name: 'Admin - Doexcess Support',
    message: 'New feature ‘Bulk Message Creator’ is',
    time: '1hr',
    unreadCount: 0,
    avatar: '/icons/icon.png',
    isActive: false,
    isRead: false,
    isSystem: true,
  },
  {
    name: 'Mira Press',
    message: 'What’s the status of my event ticket',
    time: '1hr',
    unreadCount: 3,
    avatar: '/icons/chat/avatars/image5.png',
    isActive: false,
    isRead: false,
  },
];

export default function MessageList() {
  return (
    <div className='w-full max-w-md mx-auto bg-white dark:bg-gray-800 h-[550px] overflow-y-auto rounded-md'>
      {messages.map((msg, index) => (
        <div
          key={index}
          className={clsx(
            'flex items-center px-4 py-3 border-b dark:border-black-2 border-gray-400 cursor-pointer hover:bg-primary-main hover:text-white dark:hover:text-white',
            msg.isActive && 'bg-primary-main text-white',
            index === messages.length - 1 && 'border-b-0',
            index === 0 && 'pb-3'
          )}
        >
          <Image
            src={msg.avatar}
            alt={msg.name}
            width={48}
            height={48}
            className='rounded-full object-cover'
          />
          <div className='ml-3 flex-1 min-w-0'>
            <div className='flex justify-between items-center'>
              <p
                className={clsx(
                  'font-bold text-sm truncate',
                  msg.isActive ? 'text-white' : ' dark:text-gray-100'
                )}
              >
                {msg.name}
              </p>
              <span className={clsx('text-xs font-medium')}>{msg.time}</span>
            </div>
            <div className='flex justify-between items-center'>
              <p className={clsx('text-sm truncate')}>{msg.message}</p>
              {msg.unreadCount > 0 && (
                <span
                  className={clsx(
                    'ml-2 text-xs px-2 py-1 rounded-full bg-indigo-100 text-primary-main font-semibold'
                  )}
                >
                  {msg.unreadCount}
                </span>
              )}
              {msg.isRead && msg.isActive && (
                <Icon url='/icons/chat/check.svg' />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
