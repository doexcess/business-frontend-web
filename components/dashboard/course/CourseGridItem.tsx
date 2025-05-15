import Icon from '@/components/ui/Icon';
import { formatMoney } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

interface CourseGridItemProps {
  id: string;
  title: string;
  price?: number;
  imageSrc: string;
}

const CourseGridItem = ({
  id,
  title,
  price,
  imageSrc,
}: CourseGridItemProps) => {
  return (
    <div className='shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden space-y-2 mb-4'>
      <Link href={`/products/tickets/${id}/edit`}>
        <img
          className='w-full h-48 object-cover rounded-xl'
          src={imageSrc}
          alt={title}
        />
      </Link>
      <div className=''>
        <Link href={`/products/tickets/${id}/edit`}>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white truncate'>
            {title}
          </h3>
        </Link>
        <p className='text-gray-600 dark:text-gray-300 mb-4 text-sm'>
          {price && formatMoney(price)}
        </p>
        <Link
          href={`/products/tickets/${id}/edit`}
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
