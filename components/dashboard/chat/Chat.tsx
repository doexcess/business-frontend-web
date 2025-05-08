'use client';

import Icon from '@/components/ui/Icon';
import Input from '@/components/ui/Input';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { socketService } from '@/lib/services/socketService';
import {
  clearChatState,
  messagesRetrieved,
  messagesSent,
  retrieveMessages,
  sendMessage,
} from '@/redux/slices/chatSlice';
import { useParams } from 'next/navigation';
import { useSocket } from '@/context/SocketProvider';
import { MessagesResponse, SentMessageResponse } from '@/types/chat';
import Link from 'next/link';

export default function Chat() {
  const { id: chatId, chatbuddyId }: { id: string; chatbuddyId: string } =
    useParams();
  const { isConnected } = useSocket();
  const [input, setInput] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(true);
  const [isMessageSent, setIsMessageSent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { token, profile } = useSelector((state: RootState) => state.auth);
  const { messages, chat, latestMessage } = useSelector(
    (state: RootState) => state.chat
  );

  // Handle message retrieval
  useEffect(() => {
    if (!isConnected || !token) return;

    const handleMessagesRetrieved = (response: MessagesResponse) => {
      if (response.status === 'success') {
        dispatch(
          messagesRetrieved({
            messages: response.data.result,
            chatId: response.data.chatId,
          })
        );
        setIsLoading(false);
      }
    };

    socketService.on(
      `messagesRetrieved:${profile?.id}`,
      handleMessagesRetrieved
    );
    dispatch(retrieveMessages({ token, chatBuddy: chatbuddyId }));

    return () => {
      socketService.off(
        `messagesRetrieved:${profile?.id}`,
        handleMessagesRetrieved
      );
    };
  }, [token, dispatch, profile?.id, chatbuddyId, isConnected]);

  // Handle sent messages
  useEffect(() => {
    if (!isConnected || !token) return;

    const handleMessagesSent = (response: SentMessageResponse) => {
      if (response.status === 'success') {
        console.log(response.data);
        dispatch(messagesSent(response.data));
        setIsMessageSent(false);
      }
    };

    socketService.on(`messageSent:${chatId}`, handleMessagesSent);

    return () => {
      socketService.off(`messageSent:${chatId}`, handleMessagesSent);
    };
  }, [token, dispatch, isConnected, chatId, isMessageSent, latestMessage]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim() || !token) return;

    setIsMessageSent(true);
    dispatch(
      sendMessage({
        token,
        chatBuddy: chatbuddyId,
        message: input,
      })
    );
    setInput('');
  };

  const renderMessage = (message: any) => (
    <div
      key={message.id}
      className={`flex ${
        message.initiator_id === profile?.id ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${
          message.initiator_id === profile?.id
            ? 'bg-indigo-100 dark:bg-primary-main rounded-se-none'
            : 'bg-gray-100 dark:bg-gray-700 rounded-ss-none'
        }`}
      >
        <p className='text-sm text-gray-800 dark:text-white font-bold'>
          {message.message}
        </p>
        <div className='flex justify-end items-center mt-1 gap-1'>
          <span className='text-xs text-gray-500 dark:text-gray-300'>
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {message.initiator_id === profile?.id && (
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                message.read ? 'text-blue-500' : 'text-gray-400'
              }`}
            >
              ✓
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className='mx-auto flex flex-col justify-between h-full'>
      <div className='flex flex-col'>
        {/* Header */}
        <div className='flex items-center gap-3 mb-2 px-2 md:px-3 py-2 border-b dark:border-black-2 bg-neutral-4 dark:bg-gray-800 rounded-xl'>
          <div className='flex items-center'>
            <Link
              href='/messages'
              className='flex md:hidden dark:invert dark:brightness-0'
            >
              <Icon url='/icons/clients/angle-left.svg' width={30} />
            </Link>
            <Icon
              url={
                chat?.chat_buddy?.profile?.profile_picture || '/icons/icon.png'
              }
              width={40}
              height={40}
              className='rounded-full object-cover'
            />
          </div>
          <div className='flex flex-col'>
            <p className='font-semibold text-gray-800 dark:text-white'>
              {chat?.chat_buddy?.name}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className='flex-1 overflow-y-auto p-4 space-y-6 max-h-[64vh] md:max-h-[60vh] lg:max-h-[68vh]'>
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className='p-4 dark:border-black-2 bg-neutral-4 dark:bg-gray-800 flex gap-2 rounded-xl border-t'>
        <button className='text-gray-400'>
          <Icon url='/icons/chat/clip.svg' width={30} />
        </button>
        <Input
          type='text'
          name='message'
          className='flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-main'
          placeholder='Type something'
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
            e.key === 'Enter' && handleSendMessage()
          }
        />
        <button
          className='bg-primary-main p-2 rounded-lg text-white disabled:opacity-50'
          onClick={handleSendMessage}
          disabled={!input.trim()}
        >
          <Icon url='/icons/chat/send.svg' />
        </button>
      </div>
    </div>
  );
}
