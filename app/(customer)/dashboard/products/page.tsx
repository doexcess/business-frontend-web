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
import PublicProductGridItem from '@/components/dashboard/product/course/PublicCourseGridItem';

const Products = () => {
  const [search, setSearch] = useState('');
  const [priceRange, setPriceRange] = useState('All Prices');
  const [modalOpenId, setModalOpenId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<ProductType | null>(null);
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
  const handleOpenModal = (id: string, type: ProductType) => {
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
            {loading
              ? Array.from({ length: 8 }).map((_, idx) => (
                  <ProductGridItemSkeleton key={idx} />
                ))
              : products.map((product) => (
                  <PublicProductGridItem
                    key={product.id}
                    id={product.id}
                    details={product}
                    type={product.type}
                    title={product.title}
                    imageSrc={
                      product.multimedia?.url || '/images/course/course1.png'
                    }
                    price={product.price!}
                    onView={() => {}}
                    onBuy={() => {}}
                  />
                ))}
          </div>

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
