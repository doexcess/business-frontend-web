import { Card } from '@/components/dashboard/Card';
import Chat from '@/components/dashboard/chat/Chat';
import Icon from '@/components/ui/Icon';
import Logo from '@/components/ui/Logo';
import React from 'react';

const Messages = () => {
  return (
    <>
      <div className='w-full rounded-xl h-full border dark:border-black-2 mb-3'>
        {[1].length === 0 ? (
          <div className='flex flex-col justify-center items-center h-full space-y-4'>
            <Logo />
            <p className='text-sm font-bold flex items-center gap-2'>
              <Icon url='/icons/chat/lock.svg' width={15} height={15} />
              Messages are sent and encrypted with{' '}
              <span className='text-primary-main dark:text-primary-faded'>
                end to end encryption
              </span>
            </p>
          </div>
        ) : (
          <Chat />
        )}
      </div>
    </>
  );
};

export default Messages;
