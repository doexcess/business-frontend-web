'use client';

import PageHeading from '@/components/PageHeading';
import Filter from '@/components/Filter';
import React from 'react';
import CouponsList from '@/components/dashboard/coupons/CouponsList';
import useCoupons from '@/hooks/page/useCoupons';
import { cn } from '@/lib/utils';

const Coupons = () => {
  const {
    coupons,
    loading: couponsLoading,
    count: totalCoupons,
    currentPage: couponsCurrentPage,
    onClickNext: couponsOnClickNext,
    onClickPrev: couponsOnClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  } = useCoupons();

  return (
    <main>
      <header className='section-container'>
        {/* Page heading */}
        <PageHeading title='Coupons' enableBreadCrumb={true} layer2='Coupons' />
        {/* Filter */}
        <Filter
          searchPlaceholder='Search coupons'
          showPeriod={false}
          handleSearchSubmit={handleSearchSubmit}
          handleFilterByDateSubmit={handleFilterByDateSubmit}
          handleRefresh={handleRefresh}
        />

        <CouponsList
          coupons={coupons}
          count={totalCoupons}
          onClickNext={couponsOnClickNext}
          onClickPrev={couponsOnClickPrev}
          currentPage={couponsCurrentPage}
          loading={couponsLoading}
        />
      </header>
    </main>
  );
};

export default Coupons;
