'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '../Card';
import Input from '../../ui/Input';
import Icon from '../../ui/Icon';
import MessageList from './MessageList';
import { ChatReadStatus, cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { socketService } from '@/lib/services/socketService';
import {
  chatsRetrieved,
  recentChatRetrieved,
  retrieveChats,
} from '@/redux/slices/chatSlice';
import { useSocket } from '@/context/SocketProvider';
import { RecentChatRetrievedResponse } from '@/types/chat';

const shimmerMessages = Array(7).fill({
  id: '',
  name: '',
  message: '',
  time: '',
  unreadCount: 0,
  avatar: '',
  isActive: false,
  isRead: false,
  isShimmer: true,
});

enum ChatTab {
  ALL = 'all',
  UNREAD = 'unread',
}

const ChatSidebar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { chats } = useSelector((state: RootState) => state.chat);
  const { token, profile } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [chatTab, setChatTab] = useState(ChatTab.ALL);

  const { isConnected } = useSocket();

  useEffect(() => {
    if (!isConnected || !token) return;

    const handleChatRetrieved = (response: RecentChatRetrievedResponse) => {
      if (response.status === 'success') {
        console.log(response.data);
        dispatch(recentChatRetrieved(response.data));
      }
    };

    socketService.on(`recentChatRetrieved:${profile?.id}`, handleChatRetrieved);

    return () => {
      socketService.off(
        `recentChatRetrieved:${profile?.id}`,
        handleChatRetrieved
      );
    };
  }, [token, dispatch, isConnected]);

  const ChatShimmer = shimmerMessages.map((shimmer, index) => (
    <div
      className={`flex items-center gap-3 p-4 ${
        index !== chats.length - 1
          ? 'border-b border-gray-100 dark:border-gray-700'
          : ''
      }`}
    >
      <div className='relative h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 animate-pulse' />
      <div className='flex-1 space-y-2'>
        <div className='h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-600 animate-pulse' />
        <div className='h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-600 animate-pulse' />
      </div>
      <div className='h-3 w-10 rounded bg-gray-200 dark:bg-gray-600 animate-pulse' />
    </div>
  ));

  const fetchChats = (tab: ChatTab) => {
    setIsLoading(true);
    setChatTab(tab);
  };

  useEffect(() => {
    if (!token) return;
    if (!isConnected) return;

    // Setup event listeners
    const handleChatsRetrieved = (response: any) => {
      if (response.status === 'success') {
        dispatch(chatsRetrieved(response.data.result));
        setIsLoading(false);
      }
    };

    socketService.on(`chatsRetrieved:${profile?.id}`, handleChatsRetrieved);

    // Load initial chats
    dispatch(
      retrieveChats({
        token,
        status: chatTab !== ChatTab.ALL ? ChatReadStatus.READ : undefined,
      })
    );

    return () => {
      // Clean up listeners and disconnect
      socketService.off(`chatsRetrieved:${profile?.id}`, handleChatsRetrieved);
    };
  }, [token, dispatch, profile, chatTab, isConnected]);

  return (
    <Card
      className={cn(
        'w-full md:w-[35%] h-full bg-neutral-2 p-4 flex-col rounded-lg',
        pathname === '/messages' ? 'flex' : 'hidden md:flex'
      )}
    >
      {/* Header tabs */}
      <div className='flex space-x-4 mb-6'>
        <button
          className={cn(
            'flex-1 text-sm font-bold py-2 ',
            chatTab === ChatTab.ALL && 'bg-primary-main rounded-lg text-white'
          )}
          onClick={() => fetchChats(ChatTab.ALL)}
        >
          All Chats
        </button>
        <button
          className={cn(
            'flex-1 text-sm font-bold py-2 ',
            chatTab === ChatTab.UNREAD &&
              'bg-primary-main rounded-lg text-white'
          )}
          onClick={() => fetchChats(ChatTab.UNREAD)}
        >
          Unread
        </button>
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

      {isLoading ? (
        ChatShimmer
      ) : chats.length === 0 ? (
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
          <MessageList chats={chats} />
        </main>
      )}
    </Card>
  );
};

export default ChatSidebar;
