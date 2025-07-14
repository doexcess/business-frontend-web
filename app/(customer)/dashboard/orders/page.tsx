'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeading from '@/components/PageHeading';
import Filter from '@/components/Filter';
import Pagination from '@/components/Pagination';
import NotFound from '@/components/ui/NotFound';
import ClientPaymentItem from '@/components/dashboard/payment/ClientPaymentItem';
import { Modal } from '@/components/ui/Modal';
import useClientPayments from '@/hooks/page/useClientPayments';
import { Payment } from '@/types/payment';
import { formatMoney } from '@/lib/utils';
import {
  Package,
  Calendar,
  CreditCard,
  User,
  MapPin,
  ShoppingBag,
  Play,
  BookOpen,
  Video,
  FileText,
  CheckCircle,
  Lock,
  Clock,
} from 'lucide-react';

const Orders = () => {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const {
    payments,
    count,
    loading,
    error,
    currentPage,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  } = useClientPayments();

  const handleViewPaymentDetails = (paymentId: string) => {
    const payment = payments.find((p) => p.id === paymentId);
    if (payment) {
      setSelectedPayment(payment);
      setShowPaymentModal(true);
    }
  };

  const handlePreviewCourse = (courseId: string) => {
    router.push(`/dashboard/orders/${courseId}/learning`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPurchaseTypeLabel = (type: string) => {
    switch (type) {
      case 'TICKET':
        return 'Event Ticket';
      case 'COURSE':
        return 'Course';
      case 'SUBSCRIPTION':
        return 'Subscription';
      case 'PRODUCT':
        return 'Product';
      default:
        return type;
    }
  };

  const hasCoursePurchase = (payment: Payment) => {
    return payment.purchase?.items?.some(
      (item) => item.purchase_type === 'COURSE'
    );
  };

  const getCourseId = (payment: Payment) => {
    const courseItem = payment.purchase?.items?.find(
      (item) => item.purchase_type === 'COURSE'
    );
    return courseItem?.product_id;
  };

  return (
    <main className='min-h-screen text-gray-900 dark:text-white'>
      <div className='section-container pb-4'>
        <PageHeading
          title='My Orders'
          brief='View and track your order history'
          enableBreadCrumb={true}
          layer2='Dashboard'
          layer2Link='/dashboard'
          layer3='Orders'
        />

        <div className='flex flex-col gap-4 mt-2'>
          <Filter
            pageTitle='Order History'
            searchPlaceholder='Search orders...'
            showPeriod={false}
            enableRightSearchBar={true}
            showFullSearchWidth={true}
            showFilterByDate={true}
            handleSearchSubmit={handleSearchSubmit}
            handleFilterByDateSubmit={handleFilterByDateSubmit}
            handleRefresh={handleRefresh}
          />

          {loading ? (
            <div className='space-y-4'>
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className='bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse'
                >
                  <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4'></div>
                  <div className='h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2'></div>
                  <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4'></div>
                  <div className='h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4'></div>
                  <div className='h-10 bg-gray-300 dark:bg-gray-600 rounded'></div>
                </div>
              ))}
            </div>
          ) : payments.length === 0 ? (
            <NotFound
              title='No Orders Found'
              description={
                "You haven't placed any orders yet. Start shopping to see your order history here."
              }
              searchPlaceholder='Search orders...'
              onSearch={handleSearchSubmit}
            />
          ) : (
            <div className='space-y-4'>
              {payments.map((payment) => (
                <div key={payment.id} className='relative'>
                  <ClientPaymentItem
                    payment={payment}
                    onViewDetails={handleViewPaymentDetails}
                  />
                  {/* Course Preview Button */}
                  {hasCoursePurchase(payment) && (
                    <div className='absolute top-4 right-4'>
                      <button
                        onClick={() =>
                          handlePreviewCourse(getCourseId(payment)!)
                        }
                        className='bg-primary-main hover:bg-primary-dark text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors duration-200'
                      >
                        <BookOpen className='w-4 h-4' />
                        Start Learning
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className='text-red-600 dark:text-red-400 text-center py-4'>
              {error}
            </div>
          )}

          {/* Pagination */}
          {count > 0 && (
            <Pagination
              total={count}
              currentPage={currentPage}
              onClickNext={onClickNext}
              onClickPrev={onClickPrev}
              noMoreNextPage={payments.length === 0}
              paddingRequired={false}
            />
          )}
        </div>
      </div>

      {/* Payment Details Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title={`Payment #${selectedPayment?.transaction_id}`}
        className='max-w-4xl'
      >
        {selectedPayment && (
          <div className='space-y-6'>
            {/* Payment Summary */}
            <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
              <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>
                Payment Summary
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex items-center gap-2'>
                  <Package className='w-4 h-4 text-gray-500' />
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    Status:{' '}
                    <span className='font-medium text-gray-900 dark:text-white'>
                      {selectedPayment.payment_status}
                    </span>
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <Calendar className='w-4 h-4 text-gray-500' />
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    Date:{' '}
                    <span className='font-medium text-gray-900 dark:text-white'>
                      {formatDate(selectedPayment.created_at)}
                    </span>
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <CreditCard className='w-4 h-4 text-gray-500' />
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    Total:{' '}
                    <span className='font-medium text-gray-900 dark:text-white'>
                      {formatMoney(
                        Number(selectedPayment.amount),
                        selectedPayment.currency
                      )}
                    </span>
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <User className='w-4 h-4 text-gray-500' />
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    Transaction ID:{' '}
                    <span className='font-medium text-gray-900 dark:text-white'>
                      {selectedPayment.transaction_id}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>
                Payment Information
              </h3>
              <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Payment Method
                    </p>
                    <p className='font-medium text-gray-900 dark:text-white'>
                      {selectedPayment.payment_method}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Currency
                    </p>
                    <p className='font-medium text-gray-900 dark:text-white'>
                      {selectedPayment.currency}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Purchase Type
                    </p>
                    <p className='font-medium text-gray-900 dark:text-white'>
                      {selectedPayment.purchase_type}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Discount Applied
                    </p>
                    <p className='font-medium text-gray-900 dark:text-white'>
                      {formatMoney(
                        Number(selectedPayment.discount_applied),
                        selectedPayment.currency
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Items */}
            <div>
              <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>
                Purchase Items ({selectedPayment.purchase?.items.length})
              </h3>
              <div className='space-y-3'>
                {selectedPayment.purchase?.items.map((item) => (
                  <div
                    key={item.id}
                    className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex-1'>
                        <h4 className='font-medium text-gray-900 dark:text-white'>
                          {item.name}
                        </h4>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                          Type: {getPurchaseTypeLabel(item.purchase_type)} |
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='font-medium text-gray-900 dark:text-white'>
                          {formatMoney(item.price, selectedPayment.currency)}
                        </p>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                          {formatMoney(item.price, selectedPayment.currency)}{' '}
                          each
                        </p>
                      </div>
                    </div>
                    {/* Course Learning Button in Modal */}
                    {item.purchase_type === 'COURSE' && (
                      <div className='mt-3 pt-3 border-t border-gray-200 dark:border-gray-700'>
                        <button
                          onClick={() => {
                            handlePreviewCourse(item.product_id);
                            setShowPaymentModal(false);
                          }}
                          className='bg-primary-main hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors duration-200'
                        >
                          <BookOpen className='w-4 h-4' />
                          Start Learning
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Business Information */}
            <div>
              <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>
                Business Information
              </h3>
              <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Business ID
                    </p>
                    <p className='font-medium text-gray-900 dark:text-white'>
                      {selectedPayment.purchase?.business_id}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Coupon Applied
                    </p>
                    <p className='font-medium text-gray-900 dark:text-white'>
                      {selectedPayment.purchase?.coupon_id || 'None'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
};

export default Orders;
