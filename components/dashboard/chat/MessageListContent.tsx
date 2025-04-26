import Icon from '@/components/ui/Icon';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

interface MessageListContentProps {
  index: number;
  msg: any;
  messages: any[];
}
const MessageListContent = ({
  index,
  msg,
  messages,
}: MessageListContentProps) => {
  const router = useRouter();

  const openChat = () => {
    router.push(`/messages/${msg.id}`);
  };

  return (
    <div
      key={index}
      className={clsx(
        'flex items-center px-4 py-3 border-b dark:border-black-2 border-gray-400 cursor-pointer hover:bg-primary-main hover:text-white dark:hover:text-white',
        msg.isActive && 'bg-primary-main text-white',
        index === messages.length - 1 && 'border-b-0',
        index === 0 && 'pb-3'
      )}
      onClick={openChat}
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
          {msg.isRead && msg.isActive && <Icon url='/icons/chat/check.svg' />}
        </div>
      </div>
    </div>
  );
};

export default MessageListContent;
