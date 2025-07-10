'use client';

import PageHeading from '@/components/PageHeading';
import React, { useState } from 'react';
import CourseFilters from '@/components/dashboard/product/course/CourseFilters';
import PublicCourseGridItem from '@/components/dashboard/product/course/PublicCourseGridItem';
import useProducts from '@/hooks/page/useProducts';
import Pagination from '@/components/Pagination';

const Courses = () => {
  const [search, setSearch] = useState('');
  const [priceRange, setPriceRange] = useState('All Prices');
  const {
    products = [],
    count = 0,
    loading,
    error,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleRefresh,
    limit = 10,
    currentPage,
  } = useProducts('COURSE', search, priceRange);

  // Optionally filter products by price range here if needed

  return (
    <main className='min-h-screen bg-black text-white'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Courses'
          brief='Buy your courses with ease'
          enableBreadCrumb={true}
          layer2='Products'
          layer2Link='/products'
          layer3='Courses'
          layer3Link='/products/courses'
        />
        <div className='flex flex-col gap-4 mt-2'>
          <CourseFilters
            search={search}
            priceRange={priceRange}
            onSearch={setSearch}
            onPriceRangeChange={setPriceRange}
          />
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
            {products.map((course: any) => (
              <PublicCourseGridItem
                key={course.id}
                id={course.id}
                title={course.title}
                imageSrc={
                  course.imageSrc ||
                  course.multimedia?.url ||
                  '/images/course/course1.png'
                }
                price={course.price}
                onView={() => {}}
                onBuy={() => {}}
              />
            ))}
          </div>
          {count > limit && (
            <Pagination
              currentPage={currentPage}
              total={count}
              onClickNext={onClickNext}
              onClickPrev={onClickPrev}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Courses;
