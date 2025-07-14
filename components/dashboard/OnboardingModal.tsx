import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  FaBuilding,
  FaCreditCard,
  FaUsers,
  FaShoppingBag,
  FaCheckCircle,
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/progress';
import { Modal } from '@/components/ui/Modal';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  path?: string;
  isCompleted: boolean;
}

interface OnboardingModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const OnboardingModal = ({ isOpen, setIsOpen }: OnboardingModalProps) => {
  const router = useRouter();
  const { orgs, org } = useSelector((state: RootState) => state.org);

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Business Information',
      description: 'Provide your business details to get started',
      icon: <FaBuilding className='w-6 h-6 text-blue-500' />,
      action: 'Complete Profile',
      path: '/settings?tab=business-account',
      isCompleted: org?.onboarding_status?.current_step! >= 1,
    },
    {
      id: 2,
      title: 'Withdrawal Account',
      description: 'Set up your bank account for receiving payments',
      icon: <FaCreditCard className='w-6 h-6 text-green-500' />,
      action: 'Add Account',
      path: '/settings?tab=bank-account',
      isCompleted: org?.onboarding_status?.current_step! >= 2,
    },
    {
      id: 3,
      title: 'Invite Team Members',
      description: 'Add your team members to collaborate',
      icon: <FaUsers className='w-6 h-6 text-purple-500' />,
      action: 'Invite Team',
      path: '/team',
      isCompleted: org?.onboarding_status?.current_step! >= 3,
    },
    {
      id: 4,
      title: 'Create Your First Product',
      description: 'Start by creating a course, event, or subscription',
      icon: <FaShoppingBag className='w-6 h-6 text-orange-500' />,
      action: 'Create Product',
      path: '/products',
      isCompleted: Boolean(),
    },
  ];

  const handleStepClick = (step: OnboardingStep) => {
    if (step.path) {
      router.push(step.path);
    }
  };

  const getProgressPercentage = () => {
    const completedSteps = steps.filter((step) => step.isCompleted).length;
    return (completedSteps / steps.length) * 100;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title='Welcome to Your Business Dashboard'
      className='max-w-xl w-[95%] sm:w-full'
    >
      <div className=''>
        {/* Progress Bar */}
        <div className='w-full space-y-2'>
          <Progress value={getProgressPercentage()} className='h-2' />
          <p className='text-sm text-right text-gray-800 dark:text-gray-200'>
            {Math.round(getProgressPercentage())}% Complete
          </p>
        </div>

        {/* Steps */}
        <div className='space-y-4 mt-6'>
          {steps.map((step) => (
            <div
              key={step.id}
              className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-all ${
                step.isCompleted
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
              onClick={() => handleStepClick(step)}
            >
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4'>
                <div className='flex items-start sm:items-center gap-3 sm:gap-4'>
                  <div className='relative flex-shrink-0'>
                    {step.icon}
                    {step.isCompleted && (
                      <FaCheckCircle className='absolute -top-2 -right-2 text-green-500 w-4 h-4' />
                    )}
                  </div>
                  <div>
                    <h4 className='font-medium text-gray-900 dark:text-white text-sm sm:text-base'>
                      {step.title}
                    </h4>
                    <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5'>
                      {step.description}
                    </p>
                  </div>
                </div>
                <Button
                  variant={step.isCompleted ? 'outline' : 'primary'}
                  className='w-full sm:w-auto min-w-[120px] text-sm'
                >
                  {step.isCompleted ? 'Completed' : step.action}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className='flex justify-end mt-6'>
          <Button
            variant='outline'
            onClick={() => setIsOpen(false)}
            className='w-full sm:w-auto text-sm text-gray-800 dark:text-white hover:text-white hover:bg-gray-800  dark:hover:bg-gray-400'
          >
            I'll do this later
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default OnboardingModal;
