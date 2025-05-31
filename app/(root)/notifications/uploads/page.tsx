'use client';

import React, { useState } from 'react';
import { Modal } from 'flowbite-react';
import { capitalize } from 'lodash';

import { dummyUploads } from '@/constants';
import { HiDuplicate, HiLink, HiOutlineUpload } from 'react-icons/hi';
import PageHeading from '@/components/PageHeading';
import Pagination from '@/components/Pagination';
import Filter from '@/components/Filter';
import CreateUpload from '@/components/uploads/CreateUpload';

const Uploads = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <main>
      <header className='section-container'>
        {/* Page Heading */}
        <PageHeading title='Uploads' enableBreadCrumb={true} layer2='Uploads' />

        {/* Filter */}
        <Filter extra={<CreateUpload />} />
      </header>
      <section className='section-container-padding-0'>
        <div className='overflow-x-auto rounded-none'>
          <div className='relative overflow-x-auto'>
            <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th scope='col' className='px-6 py-3'>
                    Resource type
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Format
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Folder
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Url
                  </th>
                  <th scope='col' className='px-6 py-3'></th>
                </tr>
              </thead>
              <tbody>
                {dummyUploads.map((upload) => (
                  <tr
                    key={upload.id}
                    className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
                  >
                    <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
                      {upload.resourceType}
                    </td>
                    <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
                      {upload.format}
                    </td>
                    <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
                      {upload.folder}
                    </td>
                    <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
                      {upload.link}
                    </td>

                    <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
                      <button
                        type='button'
                        className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
                      >
                        <HiDuplicate />
                      </button>
                      <button
                        type='button'
                        className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
                      >
                        <HiLink />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <Pagination />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Uploads;
