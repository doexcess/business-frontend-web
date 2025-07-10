'use client';

import React, { useState } from 'react';
import useCart from '@/hooks/page/useCart';
import { formatMoney, ProductType } from '@/lib/utils';
import PageHeading from '@/components/PageHeading';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchCart, removeCartItem } from '@/redux/slices/cartSlice';
import { Modal } from '@/components/ui/Modal';

const PaystackButton = dynamic(
  () => import('react-paystack').then((mod) => mod.PaystackButton),
  { ssr: false }
);

const DashboardCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cart, loading, error } = useCart();
  const items = cart?.items || [];
  const total = items.reduce(
    (sum, item) => sum + Number(item.price_at_time) * item.quantity,
    0
  );
  const { profile } = useSelector((state: RootState) => state.auth);

  // Replace with the logged-in user's email in production
  const userEmail = profile?.email || '';
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_KEY || '';
  const reference = `ref-${Date.now()}`;

  const [isPaying, setIsPaying] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  const paystackProps = {
    email: userEmail,
    amount: total * 100, // Paystack expects amount in kobo
    reference,
    publicKey,
    text: isPaying ? 'Processing...' : 'Checkout',

    disabled: isPaying,
    onSuccess: () => {
      setIsPaying(false);
      toast.success('Payment successful!');
      // Optionally: clear cart, redirect, etc.
    },
    onClose: () => {
      setIsPaying(false);
      toast('Payment window closed');
    },
    onClick: () => setIsPaying(true),
  };

  return (
    <main className='min-h-screen dark:bg-black text-gray-900 dark:text-white'>
      <div className='section-container py-8'>
        <PageHeading
          title='Your Cart'
          brief='Buy your products with ease'
          enableBreadCrumb={true}
          layer2='Cart'
          layer2Link='/dashboard/cart'
        />

        <div className='mt-3'>
          {loading ? (
            <div className='text-center py-12'>Loading cart...</div>
          ) : error ? (
            <div className='text-center py-12 text-red-500'>{error}</div>
          ) : items.length === 0 ? (
            <div className='text-center py-12 text-gray-400'>
              Your cart is empty.
            </div>
          ) : (
            <div className='flex flex-col gap-6'>
              <div className='overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'>
                <table className='min-w-[600px] w-full divide-y divide-gray-200 dark:divide-gray-700'>
                  <thead>
                    <tr>
                      <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                        Product
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                        Price
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                        Quantity
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                        Total
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className='px-4 py-3 flex items-center gap-3 w-56 min-w-[14rem]'>
                          <img
                            src={
                              item.product_type === ProductType.TICKET
                                ? item?.ticket_tier?.ticket.product.multimedia
                                    ?.url || '/images/course/course1.png'
                                : item.course?.multimedia?.url ||
                                  '/images/course/course1.png'
                            }
                            alt={
                              item.product_type === ProductType.TICKET
                                ? item?.ticket_tier?.name || 'Ticket'
                                : item.course?.title || 'Product'
                            }
                            className='w-14 h-14 object-cover rounded border border-gray-200 dark:border-gray-700'
                          />
                          <span className='font-medium'>
                            {item.product_type === ProductType.TICKET ? (
                              <>
                                {item.ticket_tier?.name || 'Ticket'} (
                                {item.ticket_tier?.ticket.product.title})
                              </>
                            ) : (
                              item.course?.title || 'Product'
                            )}
                          </span>
                        </td>
                        <td className='px-4 py-3'>
                          {formatMoney(Number(item.price_at_time))}
                        </td>
                        <td className='px-4 py-3'>{item.quantity}</td>
                        <td className='px-4 py-3 font-semibold'>
                          {formatMoney(
                            Number(item.price_at_time) * item.quantity
                          )}
                        </td>
                        <td className='px-4 py-3'>
                          <button
                            className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold disabled:opacity-50'
                            disabled={loading}
                            onClick={() => setConfirmRemoveId(item.id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className='flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3'>
                <div className='text-lg font-bold flex-1 flex items-center justify-between sm:justify-start'>
                  <span>Total:</span>
                  <span className='ml-2'>{formatMoney(total)}</span>
                </div>
                <div className='flex gap-2 items-center flex-1 sm:justify-end'>
                  <PaystackButton
                    {...paystackProps}
                    className='w-full sm:w-auto bg-primary-main text-white font-bold py-2 px-6 rounded hover:bg-blue-800 transition'
                  />
                  {isPaying && (
                    <button
                      type='button'
                      className='w-full sm:w-auto bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400 transition'
                      onClick={() => setIsPaying(false)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Confirmation Modal */}
      <Modal
        isOpen={!!confirmRemoveId}
        onClose={() => setConfirmRemoveId(null)}
        title='Remove Item'
        className='text-gray-800 dark:text-gray-200'
      >
        <div className='py-4'>
          <p>Are you sure you want to remove this item from your cart?</p>
          <div className='flex gap-4 mt-6 justify-end'>
            <button
              className='px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition'
              onClick={() => setConfirmRemoveId(null)}
            >
              Cancel
            </button>
            <button
              className='px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition'
              onClick={async () => {
                if (confirmRemoveId) {
                  await dispatch(removeCartItem(confirmRemoveId));
                  await dispatch(fetchCart());
                  toast.success('Item removed from cart');
                  setConfirmRemoveId(null);
                }
              }}
              disabled={loading}
            >
              Remove
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
};

export default DashboardCart;
