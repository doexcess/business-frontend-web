import DigitalProductsList from '@/components/dashboard/product/digital-product/DigitalProductsList';
import PhysicalProductsList from '@/components/dashboard/product/physical-product/PhysicalProductsList';
import PageHeading from '@/components/PageHeading';
import Icon from '@/components/ui/Icon';
import Link from 'next/link';
import React from 'react';

const PhysicalProducts = () => {
  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Physical Products'
          brief='Simplify the way you build and manage physical products'
          enableBreadCrumb={true}
          layer2='Products'
          layer2Link='/products'
          layer3='Physical Products'
          ctaButtons={
            <div className='flex-shrink-0 self-start'>
              <Link
                href='/products/physical-products/add'
                className='text-md flex gap-1 bg-primary p-2 px-4 rounded-lg'
              >
                <Icon url='/icons/landing/plus.svg' /> Add Physical Product
              </Link>
            </div>
          }
        />

        <section className='my-4'>
          <PhysicalProductsList />
        </section>
      </div>
    </main>
  );
};

export default PhysicalProducts;
