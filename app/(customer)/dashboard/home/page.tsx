'use client';
import SelectOrgModal from '@/components/dashboard/SelectOrgModal';
import ThemeDiv from '@/components/ui/ThemeDiv';
import { AppDispatch, RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const DashboardHome = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { profile } = useSelector((state: RootState) => state.auth);
  const { orgs, org } = useSelector((state: RootState) => state.org);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showOrgModal, setShowOrgModal] = useState(false);

  useEffect(() => {
    // Show org selection modal if no org is selected
    if (!org && orgs.length > 0) {
      setShowOrgModal(true);
    }
  }, [org, orgs]);

  if (!org && orgs.length > 0) {
    return <SelectOrgModal isOpen={true} organizations={orgs} />;
  }

  return (
    <main className='section-container'>
      <div className='h-full'>
        <div className='mx-auto space-y-3 text-black-1 dark:text-white'>
          {/* Welcome Header */}
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
            <h1 className='text-2xl font-bold '>
              Welcome{profile?.name ? `, ${profile.name}` : ''}!
            </h1>
            {/* Optionally, add a profile/settings button here */}
          </div>

          {/* Organization Info or Prompt */}
          <div className='bg-white dark:bg-gray-800 border border-neutral-3 dark:border-black-2 rounded-lg shadow p-6 flex flex-col gap-2'>
            {org ? (
              <>
                <div className='text-lg font-semibold '>Your Organization</div>
                <div className=''>{org.business_name}</div>
                {/* Add more org details here if needed */}
              </>
            ) : (
              <div className='text-gray-700'>
                You are not a member of any organization yet. <br />
                {orgs.length === 0 ? (
                  <span>
                    Contact support or check your invitation email to join an
                    organization.
                  </span>
                ) : (
                  <span>Select an organization to continue.</span>
                )}
              </div>
            )}
          </div>

          {/* Dashboard Sections */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Recent Activity */}
            <div className='bg-white border rounded-lg shadow p-4 flex flex-col gap-2'>
              <div className='font-medium text-gray-800 mb-2'>
                Recent Activity
              </div>
              <div className='text-gray-500 text-sm'>
                No recent activity yet.
              </div>
            </div>

            {/* Quick Actions */}
            <div className='bg-white border rounded-lg shadow p-4 flex flex-col gap-2'>
              <div className='font-medium text-gray-800 mb-2'>
                Quick Actions
              </div>
              <button className='bg-primary-main text-white rounded px-4 py-2 text-sm font-medium hover:bg-blue-700 transition'>
                Create New Order
              </button>
              <button className='bg-blue-50 text-primary-main rounded px-4 py-2 text-sm font-medium hover:bg-blue-100 transition'>
                View Products
              </button>
            </div>

            {/* Help/Support */}
            <div className='bg-white border rounded-lg shadow p-4 flex flex-col gap-2'>
              <div className='font-medium text-gray-800 mb-2'>
                Help & Support
              </div>
              <div className='text-gray-500 text-sm'>
                Need help?{' '}
                <a
                  href={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/contact`}
                  className='text-primary-main hover:underline'
                >
                  Visit our Help Center
                </a>
                .
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardHome;
