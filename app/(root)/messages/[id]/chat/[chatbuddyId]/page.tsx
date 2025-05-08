import Chat from '@/components/dashboard/chat/Chat';
import React from 'react';

const MessageBox = () => {
  return (
    <div className='w-full rounded-xl h-[80vh] md:h-full border dark:border-black-2 mb-3'>
      <Chat />
    </div>
  );
};

export default MessageBox;
