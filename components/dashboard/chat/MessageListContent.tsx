import Icon from '@/components/ui/Icon';
import { getAvatar } from '@/lib/utils';
import { AppDispatch } from '@/redux/store';
import { Chat } from '@/types/chat';
import clsx from 'clsx';
import moment from 'moment';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch } from 'react-redux';

interface MessageListContentProps {
  index: number;
  chat: Chat & { isShimmer?: boolean };
  chats: (Chat & { isShimmer?: boolean })[];
}
const MessageListContent = ({
  index,
  chat,
  chats,
}: MessageListContentProps) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { id: chatId }: { id: string } = useParams();

  const openChat = () => {
    router.push(`/messages/${chat.id}/chat/${chat.chat_buddy.id}`);
  };

  return (
    <div
      key={index}
      className={clsx(
        'flex items-center px-4 py-3 border-b dark:border-black-2 border-gray-400 cursor-pointer hover:bg-primary-main hover:text-white dark:hover:text-white',
        chatId === chat.id && 'bg-primary-main text-white',
        index === chats.length - 1 && 'border-b-0',
        index === 0 && 'pb-3'
      )}
      onClick={openChat}
    >
      {(chat?.chat_buddy?.profile?.profile_picture! ||
        chat?.chat_buddy.name) && (
        <img
          src={getAvatar(
            chat?.chat_buddy?.profile?.profile_picture!,
            chat?.chat_buddy?.name!
          )}
          alt={chat?.chat_buddy.name}
          className='w-10 h-10 rounded-full object-cover'
        />
      )}
      <div className='ml-3 flex-1 min-w-0'>
        <div className='flex justify-between items-center'>
          <p
            className={clsx(
              'font-bold text-sm truncate',
              chatId === chat.id ? 'text-white' : ' dark:text-gray-100'
            )}
          >
            {chat.chat_buddy.name}
          </p>
          <span className={clsx('text-xs font-medium')}>
            {moment(chat.messages[0]?.created_at).fromNow()}
          </span>
        </div>
        <div className='flex justify-between items-center'>
          <p className={clsx('text-sm truncate')}>{chat.last_message}</p>
          {chat.unread > 0 && (
            <span
              className={clsx(
                'ml-2 text-xs px-2 py-1 rounded-full bg-indigo-100 text-primary-main font-semibold'
              )}
            >
              {chat.unread}
            </span>
          )}
          {chat.messages[0]?.read && <Icon url='/icons/chat/check.svg' />}
        </div>
      </div>
    </div>
  );
};

export default MessageListContent;
