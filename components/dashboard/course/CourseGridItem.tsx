import Icon from '@/components/ui/Icon';
import { formatMoney } from '@/lib/utils';
import { Course } from '@/types/product';
import Link from 'next/link';
import React from 'react';

interface CourseGridItemProps {
  id: string;
  title: string;
  price?: string;
  imageSrc: string;
  data?: Course;
}

const CourseGridItem = ({
  id,
  title,
  price,
  imageSrc,
  data,
}: CourseGridItemProps) => {
  return (
    <div className='shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden mb-4 min-h-[320px] flex flex-col justify-between rounded-xl'>
      <Link href={`/products/courses/${id}/edit`}>
        <img
          className='w-full h-48 object-cover rounded-t-xl'
          src={imageSrc}
          alt={title}
        />
      </Link>
      <div className='flex flex-col flex-grow justify-between px-4 py-3 space-y-2'>
        <div>
          <Link href={`/products/courses/${id}/edit`}>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white truncate'>
              {title}
            </h3>
          </Link>
          <p className='text-gray-600 dark:text-gray-300 text-sm min-h-[20px]'>
            {price ? formatMoney(+price, data?.currency) : ''}
          </p>
        </div>
        <Link
          href={`/products/courses/${id}/edit`}
          className='flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-main rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 gap-2'
        >
          <Icon url='/icons/course/edit.svg' width={16} />
          Edit
        </Link>
      </div>
    </div>
  );
};

export default CourseGridItem;
