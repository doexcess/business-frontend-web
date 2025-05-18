'use client';

import CourseProgressIndicator from '@/components/dashboard/course/CourseProgressIndicator';
import EditCourseForm from '@/components/dashboard/course/EditCourseForm';
import PageHeading from '@/components/PageHeading';
import useCourse from '@/hooks/page/useCourse';
import moment from 'moment-timezone';
import React from 'react';

const EditCourse = () => {
  const { course } = useCourse();
  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Edit Course'
          brief={`Date created - ${moment(course?.created_at).format('LL')}`}
          enableBreadCrumb={true}
          layer2='Products'
          layer3='Courses'
          layer4='Edit Course'
          enableBackButton={true}
        />

        <section>
          {/* Step Progress Indicator */}
          <CourseProgressIndicator />

          {/* Course Form Fields */}
          <EditCourseForm />
        </section>
      </div>
    </main>
  );
};

export default EditCourse;
