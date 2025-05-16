'use client';

import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import React from 'react';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { FaEnvelope, FaCalendarAlt, FaPhone } from 'react-icons/fa';
import Avatar from '@/components/ui/Avatar'; // Make sure this component exists
import DeactivateIcon from '@/components/ui/icons/DeactivateIcon';

const teamMember = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  role: 'Admin',
  status: 'Active',
  phone: '+1 (555) 123-4567',
  joinedDate: '2023-08-15',
  avatarUrl: '/icons/chat/avatars/image1.png',
};

const TeamMember = () => {
  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900 pb-12'>
      <div className='section-container space-y-6'>
        {/* Page Heading */}
        <PageHeading
          title='Team Member'
          brief='Manage your team member'
          enableBreadCrumb
          layer2='Team'
          layer3='Team Member'
          enableBackButton
          ctaButtons={
            <Button variant='red' className='text-md flex p-2 px-4 gap-2'>
              <DeactivateIcon />
              Deactivate
            </Button>
          }
        />

        {/* Profile Card */}
        <div className='w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6'>
          {/* Header */}
          <div className='flex items-center gap-5'>
            <Avatar
              src={teamMember.avatarUrl}
              alt={teamMember.name}
              size='xl'
            />
            <div>
              <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
                {teamMember.name}
              </h2>
              <div className='flex items-center gap-2 mt-1 text-sm'>
                {teamMember.role === 'Admin' && (
                  <MdOutlineAdminPanelSettings className='text-blue-500' />
                )}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    teamMember.role === 'Admin'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-800/20 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {teamMember.role}
                </span>
              </div>
            </div>
            <span
              className={`ml-auto px-3 py-1 text-sm font-semibold rounded-full ${
                teamMember.status === 'Active'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-400'
              }`}
            >
              {teamMember.status}
            </span>
          </div>

          {/* Info Grid */}
          <div className='grid md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300'>
            <div className='flex items-center gap-2'>
              <FaEnvelope className='text-gray-400 dark:text-gray-500' />
              <span>{teamMember.email}</span>
            </div>
            <div className='flex items-center gap-2'>
              <FaPhone className='text-gray-400 dark:text-gray-500' />
              <span>{teamMember.phone}</span>
            </div>
            <div className='flex items-center gap-2'>
              <FaCalendarAlt className='text-gray-400 dark:text-gray-500' />
              <span>
                Joined on {new Date(teamMember.joinedDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className='pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3'>
            <Button
              variant='outline'
              className='dark:border-gray-600 dark:text-white'
            >
              Edit Details
            </Button>
            <Button variant='red'>Remove Member</Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TeamMember;
