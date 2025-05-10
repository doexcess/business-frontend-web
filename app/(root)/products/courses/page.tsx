import CourseFilters from '@/components/dashboard/course/CourseFilters';
import RecentCourses from '@/components/dashboard/course/RecentCourses';
import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import React from 'react';

const Courses = () => {
  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Courses'
          brief='Create and manage your courses with ease'
          enableBreadCrumb={true}
          layer2='Products'
          layer3='Courses'
          ctaButtons={
            <div className='flex-shrink-0 self-start'>
              <Button variant='primary' className='text-md py-2 flex gap-1'>
                <Icon url='/icons/landing/plus.svg' /> Create Course
              </Button>
            </div>
          }
        />

        <section className='my-4'>
          {/* Recents */}
          <RecentCourses />
        </section>
      </div>
    </main>
  );
};

export default Courses;
