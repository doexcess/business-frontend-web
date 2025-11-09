'use client';

import ThemeDiv from '@/components/ui/ThemeDiv';
import React from 'react';
import ProductGridItem from '../ProductGridItem';
import Filter from '@/components/Filter';
import { PAGINATION_LIMIT, ProductStatus, ProductType } from '@/lib/utils';
import ProductGridItemSkeleton from '../ProductGridItemSkeleton';
import Pagination from '@/components/Pagination';
import usePhysicalProducts from '@/hooks/page/usePhysicalProducts';

const PhysicalProductsList = () => {
  const {
    physicalProducts,
    count,
    currentPage,
    loading,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleRefresh,
    handleFilterByDateSubmit,
  } = usePhysicalProducts();

  return (
    <ThemeDiv className='mt-3 border-0 dark:bg-transparent'>
      <div className=''>
        {/* Search and Filter - exact replication */}
        <div className='mb-2'>
          <Filter
            pageTitle='All Physical Products'
            pageTitleClass='text-xl'
            showPeriod={false}
            enableRightSearchBar={true}
            showFullSearchWidth={true}
            handleSearchSubmit={handleSearchSubmit}
            handleFilterByDateSubmit={handleFilterByDateSubmit}
            handleRefresh={handleRefresh}
          />
        </div>

        {/* Digital products List - exact styling */}
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
          {loading ? (
            <>
              {Array.from({ length: 6 }).map((_, idx) => (
                <ProductGridItemSkeleton key={idx} />
              ))}
            </>
          ) : (
            physicalProducts.map((item, index) => (
              <ProductGridItem
                key={index}
                id={item.id}
                imageSrc={item.multimedia.url}
                title={item.title}
                type={ProductType.PHYSICAL_PRODUCT}
                data={item}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && count > PAGINATION_LIMIT && (
          <Pagination
            total={count}
            currentPage={currentPage}
            onClickNext={onClickNext}
            onClickPrev={onClickPrev}
            noMoreNextPage={physicalProducts.length === 0}
          />
        )}
      </div>
    </ThemeDiv>
  );
};

export default PhysicalProductsList;
