'use client';

import { Card } from '@/components/dashboard/Card';
import { Button } from '@/components/ui/Button';
import { PurchaseItemType } from '@/lib/utils';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { fetchCourses } from '@/redux/slices/courseSlice';
import { fetchTickets } from '@/redux/slices/ticketSlice';
import { fetchSubscriptionPlans } from '@/redux/slices/subscriptionPlanSlice';
import {
  Plus,
  Download,
  CreditCard,
  BookOpen,
  Calendar,
  CheckCircle2,
  Users,
  BarChart3,
  GraduationCap,
  Clock,
  Ticket,
  Settings,
} from 'lucide-react';

const Products = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { org } = useSelector((state: RootState) => state.org);
  const { coursesCount } = useSelector((state: RootState) => state.course);
  const { count: ticketsCount } = useSelector(
    (state: RootState) => state.ticket
  );
  const { count: subscriptionsCount } = useSelector(
    (state: RootState) => state.subscriptionPlan
  );

  useEffect(() => {
    if (org?.id) {
      // Fetch all counts when the component mounts
      dispatch(fetchCourses({ business_id: org.id }));
      dispatch(fetchTickets({ business_id: org.id }));
      dispatch(fetchSubscriptionPlans({ business_id: org.id }));
    }
  }, [dispatch, org?.id]);

  const productOptions = [
    {
      type: PurchaseItemType.SUBSCRIPTION,
      title: 'Subscriptions',
      description: 'Create and manage subscription plans for your customers',
      icon: CreditCard,
      features: [
        'Recurring billing',
        'Multiple pricing tiers',
        'Subscription analytics',
        'Customer management',
      ],
      action: () => router.push('/products/subscriptions'),
    },
    {
      type: PurchaseItemType.COURSE,
      title: 'Courses',
      description: 'Design and sell online courses to your audience',
      icon: GraduationCap,
      features: [
        'Course creation tools',
        'Content management',
        'Student progress tracking',
        'Certification system',
      ],
      action: () => router.push('/products/courses'),
    },
    {
      type: PurchaseItemType.TICKET,
      title: 'Tickets',
      description: 'Sell tickets for your events and workshops',
      icon: Ticket,
      features: [
        'Event scheduling',
        'Ticket types & pricing',
        'Attendee management',
        'Event analytics',
      ],
      action: () => router.push('/products/tickets'),
    },
  ];

  return (
    <main className='section-container'>
      <div className='h-full'>
        <div className='flex-1 text-black-1 dark:text-white'>
          {/* Header */}
          <header className='flex flex-col md:flex-row justify-between md:items-center mb-8'>
            <div>
              <h2 className='text-2xl font-semibold'>Products</h2>
              <p className='text-gray-600 dark:text-gray-300 mt-1'>
                Manage your subscriptions, courses, and event tickets
              </p>
            </div>
            <div className='flex gap-2 mt-4 md:mt-0'>
              <Button
                variant='outline'
                className='text-lg border-primary-main text-primary-main py-1 dark:text-white hover:bg-primary-800 hover:text-white'
                onClick={() => router.push('/products/import')}
              >
                <Download className='w-5 h-5 mr-2' />
                Import Products
              </Button>
            </div>
          </header>

          {/* Product Options Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {productOptions.map((product) => (
              <Card
                key={product.type}
                className='hover:shadow-lg transition-shadow'
              >
                <div className='p-6'>
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg'>
                        <product.icon className='w-6 h-6 text-primary-600 dark:text-primary-400' />
                      </div>
                      <h3 className='text-xl font-semibold'>{product.title}</h3>
                    </div>
                  </div>

                  <p className='text-gray-600 dark:text-gray-300 mb-6'>
                    {product.description}
                  </p>

                  <div className='space-y-3 mb-6'>
                    {product.features.map((feature, index) => (
                      <div key={index} className='flex items-center gap-2'>
                        <CheckCircle2 className='w-5 h-5 text-green-500' />
                        <span className='text-sm text-gray-600 dark:text-gray-300'>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant='primary'
                    className='w-full'
                    onClick={product.action}
                  >
                    Manage {product.title}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-8'>
            <Card>
              <div className='p-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <CreditCard className='w-5 h-5 text-primary-600 dark:text-primary-400' />
                  <h4 className='text-gray-600 dark:text-gray-300'>
                    Active Subscriptions
                  </h4>
                </div>
                <p className='text-2xl font-bold'>{subscriptionsCount}</p>
              </div>
            </Card>
            <Card>
              <div className='p-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <BookOpen className='w-5 h-5 text-primary-600 dark:text-primary-400' />
                  <h4 className='text-gray-600 dark:text-gray-300'>
                    Published Courses
                  </h4>
                </div>
                <p className='text-2xl font-bold'>{coursesCount}</p>
              </div>
            </Card>
            <Card>
              <div className='p-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <Calendar className='w-5 h-5 text-primary-600 dark:text-primary-400' />
                  <h4 className='text-gray-600 dark:text-gray-300'>
                    Upcoming Events
                  </h4>
                </div>
                <p className='text-2xl font-bold'>{ticketsCount}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Products;
