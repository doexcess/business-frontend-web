'use client';

import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import React, { useEffect, useState } from 'react';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import Avatar from '@/components/ui/Avatar';
import DeactivateIcon from '@/components/ui/icons/DeactivateIcon';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { reinviteMember, viewInvite } from '@/redux/slices/orgSlice';
import { ContactInviteStatus, getAvatar } from '@/lib/utils';
import { capitalize } from 'lodash';
import toast from 'react-hot-toast';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';

const TeamMember = () => {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { invite } = useSelector((state: RootState) => state.org);

  const handleResendInvite = async () => {
    try {
      setIsSubmitting(true);

      // Submit logic here
      const response: any = await dispatch(
        reinviteMember({ invite_id: params?.id as string })
      );

      if (response.type === 'contact/reinvite-member/:invite_id/rejected') {
        throw new Error(response.payload.message);
      }

      toast.success(response.payload.message);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    dispatch(viewInvite(params?.id as string));
  }, [dispatch]);

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
            <div className='flex gap-2'>
              {invite?.status === ContactInviteStatus.PENDING && (
                <Button
                  variant='outline'
                  className='text-md flex p-2 px-4 gap-2 dark:text-white dark:hover:bg-white dark:hover:text-gray-800'
                  onClick={handleResendInvite}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className='flex items-center justify-center'>
                      <LoadingIcon />
                      Processing...
                    </span>
                  ) : (
                    'Resend Invite'
                  )}
                </Button>
              )}
              <Button variant='red' className='text-md flex p-2 px-4 gap-2'>
                <DeactivateIcon />
                Deactivate
              </Button>
            </div>
          }
        />

        {/* Profile Card */}
        <div className='w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6'>
          {/* Header */}
          <div className='flex items-center gap-5'>
            {invite?.user?.profile?.profile_picture ? (
              <Avatar
                src={invite?.user?.profile?.profile_picture!}
                alt={invite?.name!}
                size='xl'
              />
            ) : (
              <img
                src={getAvatar(
                  invite?.user?.profile?.profile_picture!,
                  invite?.name!
                )}
                alt={invite?.name}
                className='w-[100px] h-[100px] rounded-full object-cover'
              />
            )}

            <div>
              <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
                {invite?.name}
              </h2>
              <div className='flex items-center gap-2 mt-1 text-sm'>
                <span className='inline-flex items-center gap-1 text-gray-700 dark:text-gray-200'>
                  {invite?.is_owner && (
                    <MdOutlineAdminPanelSettings className='text-blue-500' />
                  )}
                  <span
                    className={`font-medium px-2 py-1 rounded-full ${
                      invite?.is_owner
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-800/20 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300'
                    }`}
                  >
                    {invite?.is_owner ? 'Admin' : 'Member'}
                  </span>
                </span>
              </div>
            </div>
            <span
              className={`font-medium px-2 py-1 rounded-full ${
                invite?.status === ContactInviteStatus.ACTIVE
                  ? 'bg-green-100 text-green-700 dark:bg-green-800/20 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800/20 dark:text-yellow-400'
              }`}
            >
              {capitalize(invite?.status)}
            </span>
          </div>

          {/* Info Grid */}
          <div className='grid md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300'>
            <div className='flex items-center gap-2'>
              <FaEnvelope className='text-gray-400 dark:text-gray-500' />
              <span>{invite?.email}</span>
            </div>
            {/* <div className='flex items-center gap-2'>
              <FaPhone className='text-gray-400 dark:text-gray-500' />
              <span>{invite?.}</span>
            </div> */}
            <div className='flex items-center gap-2'>
              <FaCalendarAlt className='text-gray-400 dark:text-gray-500' />
              <span>
                Joined on {new Date(invite?.created_at!).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className='pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3'>
            {/* Later */}
            {/* <Button
              variant='outline'
              className='dark:border-gray-600 dark:text-white'
            >
              Edit Details
            </Button> */}
            <Button variant='red'>Remove Member</Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TeamMember;
