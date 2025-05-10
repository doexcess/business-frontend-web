import CircularProgress from '@/components/CircularProgress';
import ThemeDiv from '@/components/ui/ThemeDiv';
import ThemeDivBorder from '@/components/ui/ThemeDivBorder';
import Image from 'next/image';
import React from 'react';
import CourseCard from './CourseCard';
import Input from '@/components/ui/Input';
import CourseGridItem from './CourseGridItem';
import Filter from '@/components/Filter';

const RecentCourses = () => {
  return (
    <ThemeDiv className='mt-3'>
      <div className=''>
        {/* Header */}
        <h1 className='text-xl font-semibold leading-8'>Recents</h1>

        <div className='flex max-w-full overflow-x-auto mb-8 gap-3 scroll-smooth scrollbar-hide'>
          {/* Each CourseCard should not shrink */}
          <div className='flex-shrink-0 w-72 lg:w-1/3'>
            <CourseCard
              title='Wireframing Basics'
              description='Basic Principles of Design'
              imageSrc='/images/course/course1.png'
              progress={40}
            />
          </div>
          <div className='flex-shrink-0 w-72 lg:w-1/3'>
            <CourseCard
              title='User Experience Principles'
              description='Understanding User Journeys'
              imageSrc='/images/course/course2.png'
              progress={67}
            />
          </div>
          <div className='flex-shrink-0 w-72 lg:w-1/3'>
            <CourseCard
              title='Design Essentials'
              description='Basic Principles of Design'
              imageSrc='/images/course/course3.png'
              progress={54}
            />
          </div>
        </div>

        {/* Search and Filter - exact replication */}
        <div className='mb-2'>
          <Filter
            pageTitle='All Courses'
            pageTitleClass='text-xl'
            showPeriod={false}
            enableRightSearchBar={true}
            showFullSearchWidth={true}
          />
        </div>

        {/* Course List - exact styling */}
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
            <CourseGridItem
              key={item}
              imageSrc='/images/course/course2.png'
              title='Design Essentials'
              price={4000}
            />
          ))}
        </div>
      </div>
    </ThemeDiv>
  );
};

export default RecentCourses;
