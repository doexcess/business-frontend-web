'use client';

import Icon from '@/components/ui/Icon';
import Input from '@/components/ui/Input';
import Image from 'next/image';
import { useState } from 'react';
import { FiSend, FiMic, FiSmile } from 'react-icons/fi';
import { MessageMenu } from './MessageMenu';
import Link from 'next/link';

const messages = [
  {
    id: 1,
    sender: 'Edith Johnson',
    avatar: '/icons/chat/avatars/image3.png',
    time: '11:23 PM',
    text: "Hi, I'm interested in your premium consulting package. Could you provide more details?",
    fromMe: false,
  },
  {
    id: 2,
    sender: 'You',
    avatar: '/icons/profile.png',
    time: '11:45 PM',
    text: 'Hello! Our premium package includes weekly strategy sessions, 24/7 support, and a dedicated account manager.',
    fromMe: true,
  },
  {
    id: 3,
    sender: 'Edith Johnson',
    avatar: '/icons/chat/avatars/image3.png',
    time: '11:55 PM',
    text: "That sounds great. What's the monthly cost?",
    fromMe: false,
  },
  {
    id: 4,
    sender: 'You',
    avatar: '/icons/profile.png',
    time: '12:05 AM',
    text: 'The package is $1,200 per month.',
    fromMe: true,
  },
  {
    id: 5,
    sender: 'Edith Johnson',
    avatar: '/icons/chat/avatars/image3.png',
    time: '11:55 PM',
    text: "I'd like to proceed.",
    fromMe: false,
  },
  {
    id: 5,
    sender: 'Edith Johnson',
    avatar: '/icons/chat/avatars/image3.png',
    time: '11:55 PM',
    text: "I'd like to proceed.",
    fromMe: false,
  },
];

export default function Chat() {
  const [input, setInput] = useState('');

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
            <Image
              src='/icons/chat/avatars/image3.png'
              alt='Edith Johnson'
              width={40}
              height={40}
              className='rounded-full object-cover'
            />
          </div>
          <div className='flex flex-col'>
            <p className='font-semibold text-gray-800 dark:text-white'>
              Edith Johnson
            </p>
            <span className='text-xs text-green-500'>Online</span>
          </div>

          {/* Add Menu options later */}
        </div>

        {/* Messages */}
        <div className='flex-1 overflow-y-auto p-4 space-y-6 max-h-[64vh] md:max-h-[60vh] lg:max-h-[68vh]'>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className='max-w-sm'>
                {!msg.fromMe && (
                  <div className='flex items-center gap-2 mb-2'>
                    <Image
                      src={msg.avatar}
                      alt='avatar'
                      width={30}
                      height={30}
                    />
                    <div className='text-sm mb-1 text-gray-800 dark:text-white'>
                      <span className='font-bold'>{msg.sender}</span> •{' '}
                      {msg.time}
                    </div>
                  </div>
                )}

                {msg.fromMe && (
                  <div className='flex items-center justify-end gap-2 mb-2'>
                    <Image
                      src={msg.avatar}
                      alt='avatar'
                      width={30}
                      height={30}
                      className='border rounded-full bg-black-2 dark:border-gray-400 border-black-2'
                    />
                    <div className='text-sm text-gray-800 dark:text-white mb-1'>
                      <span className='font-bold'>{msg.sender}</span> •{' '}
                      {msg.time}
                    </div>
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl font-medium text-sm ${
                    msg.fromMe
                      ? 'bg-neutral-2 text-gray-700 dark:bg-primary-main dark:text-white rounded-se-none'
                      : 'bg-neutral-5 text-gray-700 dark:bg-black-2 dark:text-white rounded-ss-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className='p-4 dark:border-black-2 bg-neutral-4 dark:bg-gray-800 flex gap-2 rounded-xl border-t'>
        {/* <button className='text-gray-400'>
          <FiSmile size={24} />
        </button> */}
        <button className='text-gray-400'>
          <Icon url='/icons/chat/clip.svg' width={30} />
        </button>
        <Input
          type='text'
          name='message'
          className='flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
          placeholder='Type something'
          value={input}
          onChange={(e: any) => setInput(e.target.value)}
        />
        <button className='bg-indigo-600 p-2 rounded-lg text-white'>
          {/* <FiSend size={20} /> */}
          <Icon url='/icons/chat/send.svg' />
        </button>
      </div>
    </div>
  );
}
