import Icon from '@/components/ui/Icon';
import { formatMoney, ProductStatus } from '@/lib/utils';
import { DigitalProduct } from '@/types/product';
import Link from 'next/link';
import React from 'react';

interface DigitalProductGridItemProps {
  id: string;
  title: string;
  imageSrc: string;
  data: DigitalProduct;
}

const DigitalProductGridItem = ({
  id,
  title,
  imageSrc,
  data,
}: DigitalProductGridItemProps) => {
  const formattedPrice = formatMoney(+data.price, data.currency);
  const href = `/products/digital-products/${id}/edit`;

  const getFileTypeIcon = (fileType?: string) => {
    switch (fileType?.toUpperCase()) {
      case 'PDF':
        return '/icons/file-types/pdf.svg';
      case 'DOC':
      case 'DOCX':
        return '/icons/file-types/doc.svg';
      case 'PPT':
      case 'PPTX':
        return '/icons/file-types/ppt.svg';
      case 'XLS':
      case 'XLSX':
        return '/icons/file-types/excel.svg';
      case 'ZIP':
      case 'RAR':
        return '/icons/file-types/zip.svg';
      case 'MP4':
      case 'VIDEO':
        return '/icons/file-types/video.svg';
      case 'MP3':
      case 'AUDIO':
        return '/icons/file-types/audio.svg';
      case 'IMAGE':
        return '/icons/file-types/image.svg';
      default:
        return '/icons/file-types/file.svg';
    }
  };

  return (
    <div className='shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden mb-4 min-h-[320px] flex flex-col justify-between rounded-xl'>
      <Link href={href}>
        <div className='relative'>
          <img
            className='w-full h-48 object-cover rounded-t-xl'
            src={imageSrc}
            alt={title}
          />
          {data?.status && (
            <span
              className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded bg-opacity-90 ${
                data?.status === ProductStatus.PUBLISHED
                  ? 'bg-green-600 text-white'
                  : data?.status === ProductStatus.DRAFT
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-500 text-white'
              }`}
            >
              {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
            </span>
          )}
          {data.file_type && (
            <div className='absolute bottom-2 left-2 bg-white bg-opacity-90 rounded-lg p-1'>
              <Icon
                url={getFileTypeIcon(data.file_type)}
                width={20}
                height={20}
              />
            </div>
          )}
        </div>
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
          {data.download_limit && (
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              Downloads: {data.download_limit}
            </p>
          )}
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

export default DigitalProductGridItem;
