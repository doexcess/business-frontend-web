'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import Icon from '@/components/ui/Icon';
import { EyeIcon } from 'lucide-react';
import { formatMoney } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import useProductById from '@/hooks/page/useProductById';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { addToCart, fetchCart } from '@/redux/slices/cartSlice';
import { ProductType } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface PublicCourseGridItemProps {
  id: string;
  title: string;
  imageSrc: string;
  price: string;
  onView: () => void;
  onBuy: () => void;
}

const PublicCourseGridItem: React.FC<PublicCourseGridItemProps> = ({
  id,
  title,
  imageSrc,
  price,
  onView,
  onBuy,
}) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  // Custom hook to fetch product details by id
  const { product, loading } = useProductById(modalOpen ? id : undefined);
  const dispatch = useDispatch<AppDispatch>();
  const { count, loading: cartLoading } = useSelector(
    (state: RootState) => state.cart
  );

  const handleView = () => {
    setModalOpen(true);
    // console.log(product);
    onView();
  };

  return (
    <>
      <div className='shadow-md dark:shadow-none hover:shadow-lg transition-shadow duration-300 overflow-hidden mb-4 min-h-[320px] flex flex-col justify-between rounded-xl bg-black/80 dark:bg-transparent'>
        <div className='relative'>
          <img
            className='w-full h-48 object-cover rounded-t-xl'
            src={imageSrc}
            alt={title}
          />
        </div>
        <div className='flex flex-col flex-grow justify-between px-4 dark:px-0 py-3 space-y-2'>
          <div>
            <h3 className='text-base font-bold truncate text-gray-800 dark:text-gray-200'>
              {title}
            </h3>
            <p className='text-sm min-h-[20px] text-gray-800 dark:text-gray-200'>
              {formatMoney(+price)}
            </p>
          </div>
          <div className='flex flex-row gap-2'>
            <Button
              onClick={handleView}
              variant='outline'
              className='flex-1 flex items-center justify-center px-4 py-2 text-sm font-bold border border-primary-main rounded-md hover:bg-primary-main hover:text-white transition gap-2'
            >
              <span role='img' aria-label='View'>
                <EyeIcon size='18' />
              </span>{' '}
              View
            </Button>
            <button
              onClick={onBuy}
              className='flex-1 flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-primary-main rounded-md hover:bg-blue-800 transition gap-2'
            >
              <span role='img' aria-label='Buy'>
                <Icon url='/icons/cart.svg' width={15} />
              </span>{' '}
              Buy
            </button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={product?.title || 'Course Details'}
      >
        {loading ? (
          <div className='text-center py-8'>Loading...</div>
        ) : product ? (
          <div>
            <img
              src={product.multimedia?.url || imageSrc}
              alt={product.title}
              className='w-full h-40 object-cover rounded mb-4'
            />
            <h3 className='text-lg font-bold mb-2'>{product.title}</h3>
            <p className='mb-2 text-gray-700 dark:text-gray-300'>
              {product.description}
            </p>
            <div className='font-semibold text-primary-main mb-2'>
              {formatMoney(+product?.price!, product.currency)}
            </div>
            <button
              className='w-full bg-primary-main text-white font-bold py-2 px-4 rounded hover:bg-blue-800 transition mb-2'
              onClick={async () => {
                if (product && !count) {
                  const response = await dispatch(
                    addToCart({
                      product_id: product.id,
                      quantity: 1,
                      product_type: ProductType.COURSE,
                    })
                  ).unwrap();
                  await dispatch(fetchCart());
                  toast.success(response.message);
                } else if (count) {
                  router.push('/dashboard/cart');
                }
              }}
              disabled={cartLoading}
            >
              {count
                ? 'View in Cart'
                : cartLoading
                ? 'Adding...'
                : 'Add to Cart'}
            </button>
            {/* Add more details as needed */}
          </div>
        ) : (
          <div className='text-center py-8 text-red-500'>Course not found.</div>
        )}
      </Modal>
    </>
  );
};

export default PublicCourseGridItem;
