'use client';

import { Chat } from '@/types/chat';
import MessageListContent from './MessageListContent';

export interface MessageListProps {
  chats: Chat[];
}
export default function MessageList({ chats }: MessageListProps) {
  return (
    <div className='w-full md:max-w-md mx-auto bg-white dark:bg-gray-800 overflow-y-auto rounded-md h-[64vh] max-h-[64vh] md:max-h-[60vh] lg:max-h-[66vh] '>
      {chats.map((chat, index) => (
        <MessageListContent
          key={index}
          index={index}
          chat={chat}
          chats={chats}
        />
      ))}
    </div>
  );
}
