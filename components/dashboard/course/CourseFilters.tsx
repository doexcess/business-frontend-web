'use client';

import React from 'react';
import Select from '@/components/ui/Select';
import Icon from '@/components/ui/Icon';

const CourseFilters = () => {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4'>
      <div className=''>
        <Select
          name='category'
          className='font-bold text-base w-full' // w-full to fill grid cell
          data={['Category']}
          required={true}
          value={'Category'}
        />
      </div>
      <div className=''>
        <Select
          name='price-range'
          className='font-bold text-base w-full' // w-full to fill grid cell
          data={['Price Range']}
          required={true}
          value={'Price Range'}
        />
      </div>
    </div>
  );
};

export default CourseFilters;
