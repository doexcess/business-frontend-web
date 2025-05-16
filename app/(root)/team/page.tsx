'use client';

import React, { useState } from 'react';
import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { FaTrashAlt } from 'react-icons/fa';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { Modal } from '@/components/ui/Modal'; // Assuming you have one
import Input from '@/components/ui/Input'; // Assuming you have one
import Select from '@/components/Select'; // Assuming you have one
import Link from 'next/link';

type TeamMember = {
  name: string;
  email: string;
  role: 'Admin' | 'Member';
  status: 'Active' | 'Invited';
  avatarUrl?: string; // Optional: fallback to generated avatar
};

const initialMembers: TeamMember[] = [
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    name: 'John Smith',
    email: 'john@example.com',
    role: 'Member',
    status: 'Invited',
  },
];

const getAvatar = (email: string, name: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=random&size=32`;
};

const Team = () => {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [isInviteOpen, setInviteOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'Member',
  });

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) return;

    setMembers([
      ...members,
      {
        ...newMember,
        status: 'Invited',
      } as TeamMember,
    ]);
    setInviteOpen(false);
    setNewMember({ name: '', email: '', role: 'Member' });
  };

  const handleRemove = (email: string) => {
    setMembers(members.filter((m) => m.email !== email));
  };

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container space-y-6'>
        {/* Page Heading */}
        <PageHeading
          title='Team'
          brief='Manage your team members'
          enableBreadCrumb={true}
          layer2='Team'
          ctaButtons={
            <Button
              className='bg-primary text-md flex p-2 px-4 gap-2'
              onClick={() => setInviteOpen(true)}
            >
              <Icon url='/icons/landing/plus.svg' />
              Invite
            </Button>
          }
        />

        {/* Table */}
        <section className='overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm'>
          <table className='min-w-full text-sm text-left'>
            <thead className='bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs font-semibold tracking-wide'>
              <tr>
                <th className='p-4'>ID</th>
                <th className='p-4'>Name</th>
                <th className='p-4'>Email</th>
                <th className='p-4'>Role</th>
                <th className='p-4'>Status</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100 dark:divide-gray-700'>
              {members.map((member, index) => (
                <tr
                  key={index}
                  className='hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'
                >
                  <td className='px-4 py-4 font-medium text-gray-800 dark:text-gray-100'>
                    <Link href={`/teams/${index}`}>{index + 1}</Link>
                  </td>
                  <td className='px-4 py-3'>
                    <Link
                      href={`team/${index}`}
                      className='flex items-center gap-3'
                    >
                      <img
                        src={getAvatar(member.email, member.name)}
                        alt={member.name}
                        className='w-8 h-8 rounded-full object-cover'
                      />
                      <span className='font-medium text-gray-800 dark:text-gray-100'>
                        {member.name}
                      </span>
                    </Link>
                  </td>
                  <td className='px-4 py-2 text-gray-600 dark:text-gray-300 truncate max-w-[200px]'>
                    {member.email}
                  </td>
                  <td className='px-4 py-2'>
                    <span className='inline-flex items-center gap-1 text-gray-700 dark:text-gray-200'>
                      {member.role === 'Admin' && (
                        <MdOutlineAdminPanelSettings className='text-blue-500' />
                      )}
                      <span
                        className={`font-medium px-2 py-1 rounded-full ${
                          member.role === 'Admin'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-800/20 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300'
                        }`}
                      >
                        {member.role}
                      </span>
                    </span>
                  </td>
                  <td className='px-4 py-2'>
                    <span
                      className={`font-medium px-2 py-1 rounded-full ${
                        member.status === 'Active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-800/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800/20 dark:text-yellow-400'
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Invite Modal */}
        <Modal
          isOpen={isInviteOpen}
          onClose={() => setInviteOpen(false)}
          title='Invite Team Member'
        >
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Email Address
              </label>
              <Input
                type='email'
                placeholder='Enter email'
                value={newMember.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewMember({ ...newMember, email: e.target.value })
                }
              />
            </div>

            <div className='flex justify-end gap-2 mt-4'>
              <Button
                variant='outline'
                className='dark:border-gray-600 dark:text-white text-gray-600'
                onClick={() => setInviteOpen(false)}
              >
                Cancel
              </Button>
              <Button variant='primary' onClick={handleAddMember}>
                Send Invite
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </main>
  );
};

export default Team;
