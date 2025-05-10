import CourseProgressIndicator from '@/components/dashboard/course/CourseProgressIndicator';
import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import React from 'react';

const CourseContent = () => {
  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Add Course Contents'
          enableBreadCrumb={true}
          layer2='Products'
          layer3='Courses'
          layer4='Contents'
          enableBackButton={true}
          ctaButtons={
            <div className='flex gap-2 h-10'>
              <Button
                variant='outline'
                className='border border-primary-main hover:bg-primary-800 dark:border-gray-600 dark:hover:bg-white dark:text-white dark:hover:text-gray-900'
              >
                Save
              </Button>
              <Button
                variant='primary'
                className='dark:text-white hover:bg-primary-800 hover:text-white'
              >
                Next
              </Button>
            </div>
          }
        />

        <section className='mt-4'>
          {/* Step Progress Indicator */}
          <CourseProgressIndicator step={2} />
        </section>
      </div>
    </main>
  );
};

export default CourseContent;
