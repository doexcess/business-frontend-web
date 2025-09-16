'use client';

import React, { useState } from 'react';
import useCart from '@/hooks/page/useCart';
import {
  formatMoney,
  ProductType,
  isBrowser,
  safeRouterPush,
  reformatText,
} from '@/lib/utils';
import PageHeading from '@/components/PageHeading';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { emptyCart, fetchCart, removeCartItem } from '@/redux/slices/cartSlice';
import { Modal } from '@/components/ui/Modal';
import { createPayment, verifyPayment } from '@/redux/slices/paymentSlice';
import {
  CreatePaymentPayload,
  PaymentPurchase,
} from '@/lib/schema/payment.schema';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  ShoppingBag,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';
import { capitalize } from 'lodash';
import { applyCoupon, clearCouponData } from '@/redux/slices/couponSlice';

import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

function DashboardCart() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { coupon_info } = useSelector((state: RootState) => state.coupon);
  const { cart, loading, error, totals } = useCart();

  const items = cart?.items || [];
  // Helper to get the actual price for a cart item
  const getItemPrice = (item: (typeof items)[number]) => {
    if (item.product_type === ProductType.TICKET) {
      return Number(item.ticket_tier?.amount || 0);
    } else if (item.product_type === ProductType.COURSE) {
      return Number(item.course?.price || 0);
    } else if (item.product_type === ProductType.DIGITAL_PRODUCT) {
      return Number(item.digital_product?.price || 0);
    } else if (item.product_type === ProductType.SUBSCRIPTION) {
      return Number(item.subscription_plan_price?.price || 0);
    }
    return 0;
  };
  // Calculate the actual total sum based on product type
  const totalSum = items?.reduce(
    (sum, item) => sum + getItemPrice(item) * item.quantity,
    0
  );
  const { profile } = useSelector((state: RootState) => state.auth);
  const { org } = useSelector((state: RootState) => state.org);

  // Replace with the logged-in user's email in production
  const userEmail = profile?.email || '';
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_KEY || '';
  const reference = `ref-${Date.now()}`;

  const [isPaying, setIsPaying] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [paystackRef, setPaystackRef] = useState<string | null>(null);
  const [coupon, setCoupon] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Remove launchPaystack and loadPaystackScript

  // Payment logic for checkout CTA
  const [paystackConfig, setPaystackConfig] = useState<any | null>(null);
  const [shouldTriggerPayment, setShouldTriggerPayment] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [paystackPayment, setPaystackPayment] = useState<any>(null);

  // Ensure we're on client side before using Paystack
  // React.useEffect(() => {
  //   setIsClient(true);
  // }, []);

  // React.useEffect(() => {
  //   // Only import on the client
  //   import('react-paystack').then((mod) => {
  //     setPaystackPayment(() => mod.usePaystackPayment);
  //   });
  // }, []);

  // // Effect to trigger payment when config is ready
  // React.useEffect(() => {
  //   if (
  //     shouldTriggerPayment &&
  //     paystackConfig &&
  //     isClient &&
  //     typeof paystackPayment === 'function'
  //   ) {
  //     const initializePayment = paystackPayment(
  //       paystackConfig || { publicKey }
  //     );
  //     initializePayment(paystackConfig);
  //     setShouldTriggerPayment(false);
  //   }
  // }, [
  //   shouldTriggerPayment,
  //   paystackConfig,
  //   paystackPayment,
  //   isClient,
  //   publicKey,
  // ]);

  const handleCheckout = async () => {
    if (!userEmail) {
      toast.error('User email is required for payment.');
      return;
    }
    if (!items.length) {
      toast.error('Your cart is empty.');
      return;
    }

    setIsPaying(true);
    try {
      // Build purchases array
      const purchases: PaymentPurchase[] = items.map((item) => ({
        purchase_id:
          item.product_type === ProductType.TICKET
            ? item.ticket_tier_id!
            : item.product_type === ProductType.SUBSCRIPTION
            ? item.subscription_plan_price_id!
            : item.product_id,
        quantity: item.quantity,
        purchase_type: item.product_type as ProductType,
      }));
      // Assume all items have the same currency and business_id
      const firstItem = items[0];

      const currency =
        firstItem.product_type === ProductType.TICKET
          ? firstItem.ticket_tier?.currency || 'NGN'
          : firstItem.product_type === ProductType.SUBSCRIPTION
          ? firstItem.subscription_plan_price?.currency
          : firstItem.course?.currency || 'NGN';

      const business_id = org?.id;

      if (!business_id) {
        throw new Error('Business ID is required for payment.');
      }

      const amountToPay = coupon_info?.discountedAmount
        ? coupon_info?.discountedAmount
        : totals.subtotal;

      const payload: CreatePaymentPayload = {
        email: userEmail,
        purchases,
        amount: totalSum,
        currency,
        business_id,
      };

      // 1. Create payment
      const createRes = await dispatch(createPayment(payload)).unwrap();

      if (!createRes || !createRes.data || !createRes.data.payment_id) {
        throw new Error('Payment creation failed.');
      }
      // 2. Get reference and amount
      const reference = createRes.data.payment_id;
      setPaystackRef(reference);
      // 3. Set up Paystack config and trigger inline payment
      const config = {
        public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_KEY!, // Replace with your actual public key
        tx_ref: reference,
        amount: totalSum, // Paystack expects amount in kobo
        currency, // Or your desired currency
        customer: {
          email: userEmail,
          phone_number: profile?.phone,
          name: profile?.name!,
        },
      };

      // @ts-ignore
      const handleFlutterwavePayment = useFlutterwave(config);

      handleFlutterwavePayment({
        callback: async (response) => {
          try {
            // Verify payment using Redux
            await dispatch(verifyPayment(response.transaction_id)).unwrap();

            // Empty cart after successful payment
            dispatch(emptyCart());

            // Clear coupon data
            dispatch(clearCouponData());

            // Show success message
            toast.success('Payment successful! Your order has been placed.');

            // Redirect to orders page
            safeRouterPush(router, '/dashboard/orders');
          } catch (error: any) {
            toast.error(error.message || 'Payment verification failed');
          } finally {
            setIsPaying(false);
          }
        },
        onClose: () => {
          // handle when modal is closed
          setIsPaying(false);
          toast('Payment window closed');
        },
      });
    } catch (error: any) {
      toast.error(error.message || 'Payment failed.');
      setIsPaying(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!coupon) {
      toast.error('Enter a coupon code');
      return;
    }
    setIsApplyingCoupon(true);
    try {
      const res = await dispatch(
        applyCoupon({
          email: profile?.email!,
          code: coupon,
          amount: String(totals.subtotal),
        })
      ).unwrap();

      toast.success('Coupon applied');
    } catch (err: any) {
      console.log(err);

      toast.error(err.message || 'Failed to apply coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
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
            <div className='flex flex-col items-center justify-center py-16 px-4'>
              <div className='w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6'>
                <ShoppingCart className='w-12 h-12 text-gray-400 dark:text-gray-500' />
              </div>

              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Your cart is empty
              </h3>

              <p className='text-gray-600 dark:text-gray-400 text-center mb-8 max-w-md'>
                Looks like you haven't added any items to your cart yet. Start
                shopping to discover amazing products!
              </p>

              <div className='flex flex-col sm:flex-row gap-3'>
                <button
                  onClick={() => router.push('/dashboard/products')}
                  className='inline-flex items-center justify-center px-6 py-3 bg-primary-main text-white font-medium rounded-lg hover:bg-primary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-2'
                >
                  <ShoppingBag className='w-5 h-5 mr-2' />
                  Browse Products
                </button>

                <button
                  onClick={() =>
                    router.push('/dashboard/products/subscription-plans')
                  }
                  className='inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
                >
                  <CheckCircle className='w-5 h-5 mr-2' />
                  View Subscriptions
                </button>
              </div>

              <div className='mt-8 text-sm text-gray-500 dark:text-gray-400'>
                <p className='inline-flex items-center'>
                  <HelpCircle className='w-4 h-4 mr-1' />
                  Need help?{' '}
                  <a
                    href='/support'
                    className='text-primary-main hover:underline ml-1'
                  >
                    Contact support
                  </a>
                </p>
              </div>
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
                    {items.map((item) => {
                      const details =
                        item.product_type === ProductType.TICKET
                          ? {
                              image:
                                item.ticket_tier?.ticket?.product?.multimedia
                                  ?.url,
                              name: `${item.ticket_tier?.ticket.product.title}<br/> (${item.ticket_tier?.name} Ticket)`,
                            }
                          : item.product_type === ProductType.SUBSCRIPTION
                          ? {
                              image:
                                item.subscription_plan_price?.subscription_plan
                                  .product.multimedia.url,
                              name: `${
                                item.subscription_plan_price?.subscription_plan
                                  .name
                              } (${capitalize(
                                reformatText(
                                  item?.subscription_plan_price?.period!,
                                  '_'
                                )
                              )})`,
                            }
                          : item.product_type === ProductType.DIGITAL_PRODUCT
                          ? {
                              image: item.digital_product?.multimedia.url,
                              name: item.digital_product?.title,
                            }
                          : {
                              image: item.course?.multimedia?.url,
                              name: item.course?.title,
                            };

                      return (
                        <tr key={item.id}>
                          <td className='px-4 py-3 '>
                            <Link
                              href={`/dashboard/products/${item.product_id}`}
                              className='flex items-center gap-3'
                            >
                              <img
                                src={details.image}
                                alt={`${item.product_type} image`}
                                className='w-14 h-14 object-cover rounded border border-gray-200 dark:border-gray-700 flex-shrink-0'
                              />
                              <span
                                className='font-medium flex-1 overflow-hidden whitespace-nowrap text-ellipsis'
                                dangerouslySetInnerHTML={{
                                  __html: details?.name!,
                                }}
                              />
                            </Link>
                          </td>
                          <td className='px-4 py-3'>
                            {formatMoney(getItemPrice(item))}
                          </td>
                          <td className='px-4 py-3'>{item.quantity}</td>
                          <td className='px-4 py-3 font-semibold'>
                            {formatMoney(getItemPrice(item) * item.quantity)}
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className='flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3'>
                <div className='text-lg font-bold flex-1 flex items-center justify-between sm:justify-start'>
                  <span>Total:</span>
                  <span className='ml-2'>{formatMoney(totalSum)}</span>
                </div>
                <div className='flex gap-2 items-center flex-1 sm:justify-end'>
                  <button
                    className='w-full sm:w-auto bg-primary-main text-white font-bold py-2 px-6 rounded hover:bg-blue-800 transition disabled:opacity-60'
                    onClick={handleCheckout}
                    disabled={isPaying || loading}
                  >
                    {isPaying ? 'Processing...' : 'Checkout'}
                  </button>
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
}

export default DashboardCart;
