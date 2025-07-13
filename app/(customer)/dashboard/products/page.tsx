'use client';

import React, { useState } from 'react';
import PageHeading from '@/components/PageHeading';
import useProducts from '@/hooks/page/useProducts';
import Filter from '@/components/Filter';
import ProductGridItemSkeleton from '@/components/dashboard/product/ProductGridItemSkeleton';
import { Button } from '@/components/ui/Button';
import { EyeIcon } from 'lucide-react';
import { formatMoney } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import useProductById from '@/hooks/page/useProductById';
import { Modal } from '@/components/ui/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { addToCart, fetchCart } from '@/redux/slices/cartSlice';
import { ProductType } from '@/lib/utils';
import toast from 'react-hot-toast';
import Icon from '@/components/ui/Icon';
import { ProductDetails } from '@/types/product';
import NotFound from '@/components/ui/NotFound';

const Products = () => {
  const [search, setSearch] = useState('');
  const [priceRange, setPriceRange] = useState('All Prices');
  const [modalOpenId, setModalOpenId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'COURSE' | 'TICKET' | null>(null);
  const {
    products = [],
    count = 0,
    loading,
    error,
    handleRefresh,
  } = useProducts(undefined, search, priceRange);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { cart, loading: cartLoading } = useSelector(
    (state: RootState) => state.cart
  );

  // Fetch product details for the open modal
  const { product, loading: productLoading } = useProductById(
    modalOpenId || undefined
  );

  // Helper: open modal with type
  const handleOpenModal = (id: string, type: 'COURSE' | 'TICKET') => {
    setModalOpenId(id);
    setModalType(type);
  };

  return (
    <main className='min-h-screen  text-gray-900 dark:text-white'>
      <div className='section-container pb-4'>
        <PageHeading
          title='All Products'
          brief='Browse all available products and tickets.'
          enableBreadCrumb={true}
          layer2='Products'
          layer2Link='/products'
        />
        <div className='flex flex-col gap-4 mt-2'>
          <Filter
            pageTitle='Featured Products'
            searchPlaceholder='Search for products...'
            showPeriod={false}
            enableRightSearchBar={true}
            showFullSearchWidth={true}
            showFilterByDate={false}
            handleSearchSubmit={setSearch}
            handleRefresh={handleRefresh}
          />
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-2'>
            {loading ? (
              Array.from({ length: 8 }).map((_, idx) => (
                <ProductGridItemSkeleton key={idx} />
              ))
            ) : products.length === 0 ? (
              <NotFound
                title='No Tickets Found'
                description='No tickets are currently available. Check back later or try searching for different tickets.'
                searchPlaceholder='Search for tickets...'
              />
            ) : (
              products.map((product: ProductDetails) => (
                <div
                  key={product.id}
                  className='bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200 border border-gray-100 dark:border-gray-800'
                >
                  <div className='relative'>
                    <img
                      className='w-full h-44 object-cover rounded-t-xl'
                      src={
                        product.multimedia?.url || '/images/course/course1.png'
                      }
                      alt={product.title}
                    />
                  </div>
                  <div className='p-4 flex-1 flex flex-col'>
                    <h3 className='text-lg font-bold mb-1 truncate'>
                      {product.title}
                    </h3>
                    <div className='text-primary font-semibold mb-2'>
                      {product.type === 'TICKET' &&
                      product.ticket?.ticket_tiers?.length > 0
                        ? (() => {
                            const lowestTier =
                              product.ticket.ticket_tiers.reduce(
                                (lowest: any, tier: any) =>
                                  Number(tier.amount) < Number(lowest.amount)
                                    ? tier
                                    : lowest
                              );
                            return `${formatMoney(
                              Number(lowestTier.amount),
                              lowestTier.currency
                            )}+`;
                          })()
                        : product.price
                        ? formatMoney(Number(product.price), product.currency)
                        : 'Free'}
                    </div>
                    <div
                      className='flex-1 mb-2 text-gray-700 dark:text-gray-300 text-sm line-clamp-2'
                      dangerouslySetInnerHTML={{
                        __html: product.description || '',
                      }}
                    />
                    <Button
                      variant='primary'
                      className='mt-auto w-full flex items-center justify-center gap-2 py-2 rounded-lg text-base font-semibold shadow hover:scale-[1.03] transition-transform duration-150'
                      onClick={() => handleOpenModal(product.id, product.type)}
                    >
                      <EyeIcon size={18} /> View
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Modal for viewing product details */}
          <Modal
            isOpen={!!modalOpenId}
            onClose={() => {
              setModalOpenId(null);
              setModalType(null);
            }}
            title={product?.title || 'Product Details'}
          >
            {productLoading ? (
              <div className='text-center py-8'>Loading...</div>
            ) : product && modalType === 'COURSE' ? (
              <div>
                <img
                  src={product.multimedia?.url || '/images/course/course1.png'}
                  alt={product.title}
                  className='w-full h-40 object-cover rounded mb-4'
                />
                <h3 className='text-lg font-bold mb-2'>{product.title}</h3>
                <div
                  className='mb-2 text-gray-700 dark:text-gray-300'
                  dangerouslySetInnerHTML={{
                    __html: product.description || '',
                  }}
                />
                <div className='font-semibold text-primary-main mb-2'>
                  {formatMoney(+product?.price!, product.currency)}
                </div>
                <button
                  className='w-full bg-primary-main text-white font-bold py-2 px-4 rounded hover:bg-blue-800 transition mb-2'
                  onClick={async () => {
                    if (
                      product &&
                      !cart?.items?.some(
                        (item) => item.product_id === product.id
                      )
                    ) {
                      const response = await dispatch(
                        addToCart({
                          product_id: product.id,
                          quantity: 1,
                          product_type: ProductType.COURSE,
                        })
                      ).unwrap();
                      await dispatch(fetchCart());
                      toast.success(response.message);
                    } else {
                      router.push('/dashboard/cart');
                    }
                  }}
                  disabled={cartLoading}
                >
                  {cart?.items?.some((item) => item.product_id === product.id)
                    ? 'View in Cart'
                    : cartLoading
                    ? 'Adding...'
                    : 'Add to Cart'}
                </button>
              </div>
            ) : product && modalType === 'TICKET' ? (
              <div className='flex flex-col gap-6'>
                <div className='flex flex-col gap-6 items-start'>
                  <img
                    src={
                      product.multimedia?.url || '/images/course/course1.png'
                    }
                    alt={product.title}
                    className='w-full h-56 object-cover rounded-xl shadow-lg border border-gray-200 dark:border-gray-700'
                  />
                  <div className='flex flex-col'>
                    <div
                      className='text-gray-700 dark:text-gray-300'
                      dangerouslySetInnerHTML={{
                        __html: product.description || '',
                      }}
                    />
                  </div>
                </div>
                {/* Ticket Tiers */}
                <div className='mt-2'>
                  <div className='font-semibold mb-3 text-lg text-gray-800 dark:text-gray-200'>
                    Available Tiers
                  </div>
                  {product.ticket?.ticket_tiers?.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {product.ticket.ticket_tiers.map((tier: any) => {
                        // Find if any tier for this ticket is in the cart
                        const anyTierInCart = product.ticket.ticket_tiers.some(
                          (t: any) =>
                            cart?.items?.some(
                              (item) => item.product_id === t.id
                            )
                        );
                        // Is this specific tier in the cart?
                        const tierInCart = cart?.items?.some(
                          (item) => item.product_id === tier.id
                        );
                        return (
                          <div
                            key={tier.id}
                            className='flex flex-col justify-between border border-primary/30 bg-primary/5 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-150 '
                          >
                            <div className='flex items-center gap-3'>
                              <div>
                                <div className='font-bold text-gray-800 dark:text-gray-200'>
                                  {tier.name}
                                </div>
                              </div>
                            </div>
                            <div className='flex flex-col mt-2 gap-2'>
                              <span className='font-semibold text-gray-800 dark:text-gray-200'>
                                {formatMoney(
                                  Number(tier.amount),
                                  tier.currency
                                )}
                              </span>
                              {tierInCart ? (
                                <Button
                                  variant='outline'
                                  className='font-semibold px-4 py-2 rounded-lg '
                                  onClick={() => router.push('/dashboard/cart')}
                                >
                                  View in Cart
                                </Button>
                              ) : (
                                <Button
                                  variant='primary'
                                  className='font-semibold px-4 py-2 rounded-lg shadow gap-2'
                                  onClick={async () => {
                                    try {
                                      if (!product) return;
                                      const response = await dispatch(
                                        addToCart({
                                          product_id: tier.id,
                                          quantity: 1,
                                          product_type: ProductType.TICKET,
                                        })
                                      ).unwrap();
                                      if (response.statusCode !== 200) {
                                        throw new Error(response.message);
                                      }
                                      await dispatch(fetchCart());
                                      toast.success(response.message);
                                    } catch (error: any) {
                                      toast.error(error.message);
                                    }
                                  }}
                                  disabled={anyTierInCart}
                                >
                                  <span role='img' aria-label='Buy'>
                                    <Icon url='/icons/cart.svg' width={15} />
                                  </span>{' '}
                                  Buy
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className='text-gray-500 italic'>
                      No tiers available for this ticket.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className='text-center py-8 text-red-500'>
                Product not found.
              </div>
            )}
          </Modal>
          {error && (
            <div className='text-red-500 text-center py-4'>
              {typeof error === 'string' ? error : 'Failed to load products.'}
            </div>
          )}
          {!loading && products.length === 0 && (
            <div className='text-gray-500 text-center py-8'>
              No products found.
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Products;
