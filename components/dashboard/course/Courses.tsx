'use client';

import ThemeDiv from '@/components/ui/ThemeDiv';
import React from 'react';
import CourseCard from './CourseCard';
import CourseGridItem from './CourseGridItem';
import Filter from '@/components/Filter';
import useCourses from '@/hooks/page/useCourses';
import { ProductStatus } from '@/lib/utils';

const RecentCourses = () => {
  const {
    courses,
    count,
    loading,
    handleSearchSubmit,
    handleRefresh,
    handleFilterByDateSubmit,
  } = useCourses();

  return (
    <ThemeDiv className='mt-3'>
      <div className=''>
        {/* Header */}
        <h1 className='text-xl font-semibold leading-8'>Recent Drafts</h1>
        <div className='flex max-w-full overflow-x-auto mb-8 gap-3 scroll-smooth scrollbar-hide'>
          {[
            ...courses.filter(
              (course) => course.status === ProductStatus.DRAFT
            ),
          ]
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
                />
              </div>
            ))}
        </div>

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
          {courses.map((item, index) => (
            <CourseGridItem
              key={index}
              id={item.id}
              imageSrc={item.multimedia.url}
              title={item.title}
              price={item.price}
              data={item}
            />
          ))}
        </div>
      </div>
    </ThemeDiv>
  );
};

export default RecentCourses;
