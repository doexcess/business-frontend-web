'use client';

import MessageListContent from './MessageListContent';

const messages = [
  {
    id: 'f61a9553-6c5c-41fe-97a6-d4fee6d98f6a',
    name: 'Cecilia Francis',
    message: 'Can I reschedule my onboarding sess...',
    time: '1hr',
    unreadCount: 2,
    avatar: '/icons/chat/avatars/image1.png',
    isActive: false,
    isRead: false,
  },
  {
    id: 'e9990202-6671-4a3f-863a-bfd897b464ce',
    name: 'Uchenna Anyaoku',
    message: "I'd like to upgrade to the Enterprise Plan",
    time: '1hr',
    unreadCount: 0,
    avatar: '/icons/chat/avatars/image2.png',
    isActive: false,
    isRead: false,
  },
  {
    id: 'd7383739-4b4a-4384-9ac6-467e1a3a0e2d',
    name: 'Edith Johnson',
    message: 'Start the transaction',
    time: '1hr',
    unreadCount: 0,
    avatar: '/icons/chat/avatars/image3.png',
    isActive: true,
    isRead: true,
  },
  {
    id: 'e667834e-3b72-4019-898c-7d5683f641d7',
    name: 'Adeola Bankole',
    message: "I'm having trouble uploading my course",
    time: '1hr',
    unreadCount: 5,
    avatar: '/icons/chat/avatars/image4.png',
    isActive: false,
    isRead: false,
  },
  {
    id: 'c952d766-5d57-4fc4-92fd-f9b64694fe6f',
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
    id: 'ef78619d-191a-40cd-8b3f-692623d329b1',
    name: 'Mira Press',
    message: 'What’s the status of my event ticket',
    time: '1hr',
    unreadCount: 3,
    avatar: '/icons/chat/avatars/image5.png',
    isActive: false,
    isRead: false,
  },
  {
    id: 'ef78619d-191a-40cd-8b3f-692623d329b1',
    name: 'Mira Press',
    message: 'What’s the status of my event ticket',
    time: '1hr',
    unreadCount: 3,
    avatar: '/icons/chat/avatars/image5.png',
    isActive: false,
    isRead: false,
  },
  {
    id: 'ef78619d-191a-40cd-8b3f-692623d329b1',
    name: 'Mira Press',
    message: 'What’s the status of my event ticket',
    time: '1hr',
    unreadCount: 3,
    avatar: '/icons/chat/avatars/image5.png',
    isActive: false,
    isRead: false,
  },
  {
    id: 'ef78619d-191a-40cd-8b3f-692623d329b1',
    name: 'Mira Press',
    message: 'What’s the status of my event ticket',
    time: '1hr',
    unreadCount: 3,
    avatar: '/icons/chat/avatars/image5.png',
    isActive: false,
    isRead: false,
  },
  {
    id: 'ef78619d-191a-40cd-8b3f-692623d329b1',
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
    <div className='w-full md:max-w-md mx-auto bg-white dark:bg-gray-800 overflow-y-auto rounded-md max-h-[64vh] md:max-h-[60vh] lg:max-h-[66vh]'>
      {messages.map((msg, index) => (
        <MessageListContent index={index} msg={msg} messages={messages} />
      ))}
    </div>
  );
}
