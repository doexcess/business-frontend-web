'use client';

import React, { useEffect, useState, useCallback } from 'react';
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
import { useDebounce } from '@/hooks/use-debounce';
import ContactLists from './ContactLists';

const shimmerMessages = Array(5).fill({
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

export enum ChatTab {
  ALL = 'all',
  UNREAD = 'unread',
  CONTACTS = 'contacts',
}

const ChatSidebar = () => {

  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { chats } = useSelector((state: RootState) => state.chat);
  const { token, profile } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [chatTab, setChatTab] = useState(ChatTab.ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const { isConnected } = useSocket();

  const fetchChats = useCallback(
    (tab: ChatTab, query: string = '') => {
      if (!token) return;

      setIsLoading(true);
      setChatTab(tab);

      dispatch(
        retrieveChats({
          token,
          status: tab !== ChatTab.ALL ? ChatReadStatus.UNREAD : undefined,
          ...(query && { q: query }),
        })
      ).finally(() => setIsLoading(false));
    },
    [token, dispatch]
  );

  // Fetch chats initially
  useEffect(() => {
    if (token && profile?.id) {
      fetchChats(chatTab);
    }
  }, [token, profile?.id, chatTab, fetchChats]);

  useEffect(() => {
    if (debouncedSearchQuery !== undefined && token && profile?.id) {
      fetchChats(chatTab, debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, chatTab, fetchChats, token, profile?.id]);

  useEffect(() => {
    if (isConnected && token && profile?.id && chats.length === 0) {
      fetchChats(chatTab);
    }
  }, [isConnected, token, profile?.id, chatTab, chats.length]);


  useEffect(() => {
    if (!isConnected || !token || !profile?.id) return;

    const userId = profile.id;

    const handleChatRetrieved = (response: RecentChatRetrievedResponse) => {
      if (response.status === 'success') {
        dispatch(recentChatRetrieved(response.data));
      }
    };

    const handleChatsRetrieved = (response: any) => {
      if (response.status === 'success') {
        dispatch(chatsRetrieved(response.data.result));
      }
    };

    socketService.on(`recentChatRetrieved:${userId}`, handleChatRetrieved);
    socketService.on(`chatsRetrieved:${userId}`, handleChatsRetrieved);

    return () => {
      socketService.off(`recentChatRetrieved:${userId}`, handleChatRetrieved);
      socketService.off(`chatsRetrieved:${userId}`, handleChatsRetrieved);
    };
  }, [isConnected, token, profile?.id, dispatch]);

  const ChatShimmer = shimmerMessages.map((shimmer, index) => (
    <div key={`shimmer-${index}`} className={`flex items-center gap-3 p-4 ${index !== shimmerMessages.length - 1
      ? 'border-b border-gray-100 dark:border-gray-700'
      : ''
      }`}>
      <div className='relative h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 animate-pulse' />
      <div className='flex-1 space-y-2'>
        <div className='h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-600 animate-pulse' />
        <div className='h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-600 animate-pulse' />
      </div>
      <div className='h-3 w-10 rounded bg-gray-200 dark:bg-gray-600 animate-pulse' />
    </div>
  ));

  return (
    <Card className={cn(
      'w-full md:w-[35%] h-full bg-neutral-2 p-4 flex-col rounded-lg',
      pathname === '/messages' || pathname === '/dashboard/messages'
        ? 'flex'
        : 'hidden md:flex'
    )}>

      {/* Header Tabs */}
      <div className='flex space-x-3 mb-6'>
        <button
          className={cn(
            'flex-1 text-xs font-bold py-2',
            chatTab === ChatTab.ALL && 'bg-primary-main rounded-lg text-white'
          )}
          onClick={() => fetchChats(ChatTab.ALL, searchQuery)}
        >
          All Chats
        </button>
        <button
          className={cn(
            'flex-1 text-xs font-bold py-2',
            chatTab === ChatTab.UNREAD && 'bg-primary-main rounded-lg text-white'
          )}
          onClick={() => fetchChats(ChatTab.UNREAD, searchQuery)}>
          Unread
        </button>
        <button
          className={cn(
            'flex-1 text-xs font-bold py-2',
            chatTab === ChatTab.CONTACTS && 'bg-primary-main rounded-lg text-white'
          )} onClick={() => setChatTab(ChatTab.CONTACTS)}>
          Contacts
        </button>
      </div>

      {/* Search Input */}
      <div className='relative mb-6'>
        <Input
          type='text'
          placeholder='Search'
          name='search'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isLoading}
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

      {chatTab === 'contacts' ? (
        <ContactLists setChatTab={setChatTab} searchQuery={searchQuery} />
      ) : isLoading ? (
        ChatShimmer
      ) : chats.length === 0 ? (
        <div className='h-[64vh] flex justify-center items-center'>
          <div className='flex-1 flex flex-col items-center justify-center text-center'>
            <Icon url='/icons/chat/chats.svg' width={40} height={40} />
            <p className='mb-1 font-bold'>
              {searchQuery ? 'No matching chats found' : 'No chats'}
            </p>
            <p className='text-sm mb-6'>
              {searchQuery
                ? 'Try a different search term'
                : 'You have not started any conversation'}
            </p>
          </div>
        </div>
      ) : (
        <main>
          <MessageList chats={chats} />
        </main>
      )}


    </Card>
  );
};

export default ChatSidebar;
