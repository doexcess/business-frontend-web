'use client';

import EditCouponForm from '@/components/dashboard/coupons/EditCouponForm';
import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import ActivateIcon from '@/components/ui/icons/ActivateIcon';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import { viewCoupon } from '@/redux/slices/couponSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const EditCoupon = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { coupon } = useSelector((state: RootState) => state.coupon);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(viewCoupon(params?.id as string));
  }, [dispatch]);

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900 pb-12'>
      <div className='section-container space-y-6'>
        {/* Page Heading */}
        <PageHeading
          title='Edit coupon'
          enableBreadCrumb
          layer2='Coupons'
          layer3='Edit coupon'
          layer2Link='/coupons'
          enableBackButton
          ctaButtons={
            <div className='flex gap-2'>
              <Button
                type='button'
                variant='green'
                className='text-md flex p-2 px-4 gap-2'
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className='flex items-center justify-center'>
                    <LoadingIcon />
                    Processing...
                  </span>
                ) : (
                  <>
                    <ActivateIcon />
                    Activate
                  </>
                )}
              </Button>
            </div>
          }
        />

        <EditCouponForm />
      </div>
    </main>
  );
};

export default EditCoupon;
