import Icon from '@/components/ui/Icon';
import { formatMoney } from '@/lib/utils';
import { Course, TicketProduct, TicketTier } from '@/types/product';
import Link from 'next/link';
import React from 'react';

type ProductGridItemType = 'course' | 'ticket';

interface ProductGridItemProps {
  id: string;
  title: string;
  imageSrc: string;
  type: ProductGridItemType;
  data?: Course | TicketProduct;
}

const ProductGridItem = ({
  id,
  title,
  imageSrc,
  type,
  data,
}: ProductGridItemProps) => {
  let formattedPrice = '';
  let href = `/products/${
    type === 'ticket' ? 'tickets' : 'courses'
  }/${id}/edit`;

  if (data) {
    if (type === 'ticket') {
      const ticketData = data as TicketProduct;
      const tiers = ticketData.ticket?.ticket_tiers || [];

      // Find default tier or fallback to first tier
      const defaultTier: TicketTier | undefined =
        tiers.find((tier) => tier.default_view) || tiers[0];

      if (defaultTier) {
        formattedPrice = formatMoney(+defaultTier.amount, defaultTier.currency);
      }
    } else if (type === 'course') {
      const courseData = data as Course;
      formattedPrice = formatMoney(+courseData.price, courseData.currency);
    }
  }

  return (
    <div className='shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden mb-4 min-h-[320px] flex flex-col justify-between rounded-xl'>
      <Link href={href}>
        <img
          className='w-full h-48 object-cover rounded-t-xl'
          src={imageSrc}
          alt={title}
        />
      </Link>
      <div className='flex flex-col flex-grow justify-between px-4 py-3 space-y-2'>
        <div>
          <Link href={href}>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white truncate'>
              {title}
            </h3>
          </Link>
          <p className='text-gray-600 dark:text-gray-300 text-sm min-h-[20px]'>
            {formattedPrice}
          </p>
        </div>
        <Link
          href={href}
          className='flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-main rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 gap-2'
        >
          <Icon url='/icons/course/edit.svg' width={16} />
          Edit
        </Link>
      </div>
    </div>
  );
};

export default ProductGridItem;
