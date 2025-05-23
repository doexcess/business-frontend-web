'use client';

import ThemeDiv from '@/components/ui/ThemeDiv';
import React from 'react';
import CourseCard from './CourseCard';
import ProductGridItem from '../ProductGridItem';
import Filter from '@/components/Filter';
import useCourses from '@/hooks/page/useCourses';
import { ProductStatus } from '@/lib/utils';
import ProductGridItemSkeleton from '../ProductGridItemSkeleton';

const RecentCourses = () => {
  const {
    courses,
    count,
    loading,
    handleSearchSubmit,
    handleRefresh,
    handleFilterByDateSubmit,
  } = useCourses();

  const draftedCourses = courses.filter(
    (course) => course.status === ProductStatus.DRAFT
  );

  return (
    <ThemeDiv className='mt-3'>
      <div className=''>
        {/* Header */}
        {loading ? (
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
            {Array.from({ length: 6 }).map((_, idx) => (
              <ProductGridItemSkeleton key={idx} />
            ))}
          </div>
        ) : (
          Boolean(draftedCourses.length) && (
            <>
              <h1 className='text-xl font-semibold leading-8'>Recent Drafts</h1>
              <div className='flex max-w-full overflow-x-auto mb-8 gap-3 scroll-smooth scrollbar-hide'>
                {[...draftedCourses]
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  )
                  .slice(0, 3)
                  .map((course, index) => (
                    <div key={index} className='flex-shrink-0 w-72 lg:w-1/3'>
                      <CourseCard
                        title={course.title}
                        description={course.description || 'No description'}
                        imageSrc={course.multimedia?.url}
                        progress={0}
                        data={course}
                      />
                    </div>
                  ))}
              </div>
            </>
          )
        )}

        {/* Search and Filter - exact replication */}
        <div className='mb-2'>
          <Filter
            pageTitle='All Courses'
            pageTitleClass='text-xl'
            showPeriod={false}
            enableRightSearchBar={true}
            showFullSearchWidth={true}
            handleSearchSubmit={handleSearchSubmit}
            handleFilterByDateSubmit={handleFilterByDateSubmit}
            handleRefresh={handleRefresh}
          />
        </div>

        {/* Course List - exact styling */}
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
          {loading ? (
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
              {Array.from({ length: 6 }).map((_, idx) => (
                <ProductGridItemSkeleton key={idx} />
              ))}
            </div>
          ) : (
            courses.map((item, index) => (
              <ProductGridItem
                key={index}
                id={item.id}
                imageSrc={item.multimedia.url}
                title={item.title}
                type='course'
                data={item}
              />
            ))
          )}
        </div>
      </div>
    </ThemeDiv>
  );
};

export default RecentCourses;
