import { BusinessProfileFull } from '@/types/org';
import Link from 'next/link';
import React from 'react';
import { FiArrowRight, FiCreditCard, FiPackage, FiUsers } from 'react-icons/fi';

const OnboardingAlert = ({ org }: { org: BusinessProfileFull }) => {
  const getOnboardingStep = () => {
    switch (org?.onboarding_status?.current_step) {
      case 1:
        return {
          title: 'Add Withdrawal Account',
          description:
            'Set up your withdrawal account to start receiving payments from your customers.',
          icon: <FiCreditCard className='w-5 h-5' />,
          link: '/settings?tab=bank-account',
          linkText: 'Add Withdrawal Account',
        };
      case 2:
        return {
          title: 'Invite Team Members',
          description:
            'Collaborate with your team by inviting them to manage your business.',
          icon: <FiUsers className='w-5 h-5' />,
          link: '/team',
          linkText: 'Invite Team Members',
        };
      case 3:
        return {
          title: 'Create Your First Product',
          description: 'Start selling by creating your first product listing.',
          icon: <FiPackage className='w-5 h-5' />,
          link: '/products/courses/add',
          linkText: 'Create Product',
        };
      default:
        return null;
    }
  };

  const step = getOnboardingStep();
  if (!step) return null;

  return (
    <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6'>
      <div className='flex items-start gap-4'>
        <div className='flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300'>
          {step.icon}
        </div>
        <div className='flex-1'>
          <h3 className='font-medium text-blue-900 dark:text-blue-100'>
            {step.title}
          </h3>
          <p className='text-sm text-blue-700 dark:text-blue-300 mt-1'>
            {step.description}
          </p>
          <Link
            href={step.link}
            className='inline-flex items-center gap-2 mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
          >
            {step.linkText}
            <FiArrowRight className='w-4 h-4' />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OnboardingAlert;
