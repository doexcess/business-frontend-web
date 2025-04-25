import { Card } from '@/components/dashboard/Card';
import ChatSidebar from '@/components/dashboard/ChatSidebar';
import Logo from '@/components/ui/Logo';
import React from 'react';

const Messages = () => {
  return (
    <main className='section-container'>
      <div className='flex gap-2  h-[85vh]'>
        <ChatSidebar />
        <Card className='w-full'>
          <div className='flex flex-col justify-center items-center h-full space-y-4'>
            <Logo />
            <p className='text-sm font-bold'>
              Messages are sent and encrypted with{' '}
              <span className='text-primary-main dark:text-primary-faded'>
                end to end encryption
              </span>
            </p>
          </div>
        </Card>
        {/* Main chat area would go here */}
      </div>
    </main>
  );
};

export default Messages;
