import PageHeading from '@/components/PageHeading';
import React from 'react';

const Customer = () => {
  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container space-y-6'>
        {/* Page Heading */}
        <PageHeading
          title='Customer Details'
          brief='Manage your customer'
          enableBreadCrumb
          layer2='Customer'
          layer3='Customer Details'
          layer2Link='/customers'
          enableBackButton
        />

        {/* Profile Card */}
        <div className='w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6'>
          {/* Header */}
          <div className='flex items-center gap-5'>
            {/* {invite?.user?.profile?.profile_picture ? (
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
            )} */}

            {/* <div>
              <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
                {invite?.name}
              </h2>
              <div className='flex items-center gap-2 mt-1 text-sm'>
                <span className='inline-flex items-center gap-1 text-gray-700 dark:text-gray-200'>
                  {invite?.is_owner && (
                    <MdOutlineAdminPanelSettings className='text-blue-500' />
                  )}
                  <span
                    className={`font-medium py-1 rounded-full ${
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
            </span> */}
          </div>

          {/* Info Grid */}
          <div className='grid md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300'>
            {/* <div className='flex items-center gap-2'>
              <FaEnvelope className='text-gray-400 dark:text-gray-500' />
              <span>{invite?.email}</span>
            </div> */}
            {/* <div className='flex items-center gap-2'>
              <FaPhone className='text-gray-400 dark:text-gray-500' />
              <span>{invite?.}</span>
            </div> */}
            {/* <div className='flex items-center gap-2'>
              <FaCalendarAlt className='text-gray-400 dark:text-gray-500' />
              <span>
                Joined on {new Date(invite?.created_at!).toLocaleDateString()}
              </span>
            </div> */}
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
            {/* <Button
              type='button'
              variant='red'
              onClick={() => setRemoveMemberOpenModal(true)}
              disabled={isSubmitting}
            >
              {isSubmittingRemoveMember ? (
                <span className='flex items-center justify-center'>
                  <LoadingIcon />
                  Processing...
                </span>
              ) : (
                'Remove Member'
              )}
            </Button> */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Customer;
