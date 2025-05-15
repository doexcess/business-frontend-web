'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import PageHeading from '@/components/PageHeading';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const AddTicket = () => {
  const [tiers, setTiers] = useState([
    { name: 'Regular', originalPrice: '', discountedPrice: '', quantity: '' },
  ]);
  const [isOnline, setIsOnline] = useState(true);
  const [description, setDescription] = useState('');
  const [isOneDay, setIsOneDay] = useState(true);
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleTierChange = (index: number, field: string, value: string) => {
    const updatedTiers: any = [...tiers];
    updatedTiers[index][field] = value;
    setTiers(updatedTiers);
  };

  const addTier = () => {
    setTiers([
      ...tiers,
      { name: '', originalPrice: '', discountedPrice: '', quantity: '' },
    ]);
  };

  const removeTier = (index: number) => {
    const updatedTiers = tiers.filter((_, i) => i !== index);
    setTiers(updatedTiers);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEventImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic here
    console.log('Event submitted:', {
      tiers,
      isOnline,
      description,
      isOneDay,
      eventImage,
    });
  };

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Add Ticket'
          enableBreadCrumb={true}
          layer2='Products'
          layer3='Tickets'
          layer4='Add Ticket'
          enableBackButton={true}
        />

        <form
          onSubmit={handleSubmit}
          className='bg-white dark:bg-gray-800 rounded-md shadow p-6 space-y-6'
        >
          <div>
            <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
              Event Title
            </label>
            <input
              type='text'
              required
              className='w-full border dark:border-gray-600 px-4 py-2 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white'
            />
          </div>

          <div>
            <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
              Event Description
            </label>
            <div className='quill-container'>
              <ReactQuill
                value={description}
                onChange={setDescription}
                // className='bg-white dark:bg-gray-900 text-black dark:text-white'
                className='dark:text-white'
                theme='snow'
              />
            </div>
          </div>

          <div>
            <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
              Event Type
            </label>
            <div className='flex gap-4'>
              <label className='flex items-center gap-2 text-gray-700 dark:text-white'>
                <input
                  type='radio'
                  checked={isOnline}
                  onChange={() => setIsOnline(true)}
                />
                Online
              </label>
              <label className='flex items-center gap-2 text-gray-700 dark:text-white'>
                <input
                  type='radio'
                  checked={!isOnline}
                  onChange={() => setIsOnline(false)}
                />
                Physical
              </label>
            </div>
          </div>

          <div>
            <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
              Upload Event Image
            </label>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-primary-main file:text-white hover:file:bg-primary-dark'
            />
            {imagePreviewUrl && (
              <div className='mt-4'>
                <p className='text-sm text-gray-600 dark:text-gray-300 mb-2'>
                  Preview:
                </p>
                <img
                  src={imagePreviewUrl}
                  alt='Event Preview'
                  className='max-h-64 rounded-md border dark:border-gray-600'
                />
              </div>
            )}
          </div>

          <div>
            <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
              Is it a one-day event?
            </label>
            <div className='flex gap-4'>
              <label className='flex items-center gap-2 text-gray-700 dark:text-white'>
                <input
                  type='radio'
                  checked={isOneDay}
                  onChange={() => setIsOneDay(true)}
                />
                Yes
              </label>
              <label className='flex items-center gap-2 text-gray-700 dark:text-white'>
                <input
                  type='radio'
                  checked={!isOneDay}
                  onChange={() => setIsOneDay(false)}
                />
                No
              </label>
            </div>
          </div>

          {isOneDay ? (
            <div>
              <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
                Event Date
              </label>
              <input
                type='date'
                required
                className='w-full border dark:border-gray-600 px-4 py-2 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white'
              />
            </div>
          ) : (
            <div className='grid md:grid-cols-2 gap-4'>
              <div>
                <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
                  Start Date
                </label>
                <input
                  type='date'
                  required
                  className='w-full border dark:border-gray-600 px-4 py-2 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white'
                />
              </div>
              <div>
                <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
                  End Date
                </label>
                <input
                  type='date'
                  required
                  className='w-full border dark:border-gray-600 px-4 py-2 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white'
                />
              </div>
            </div>
          )}

          <div>
            <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
              Event Time
            </label>
            <input
              type='time'
              required
              className='w-full border dark:border-gray-600 px-4 py-2 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white'
            />
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-primary-main'>
              Ticket Tiers
            </h3>

            {tiers.map((tier, index) => (
              <div
                key={index}
                className='grid md:grid-cols-4 gap-4 items-center'
              >
                <input
                  type='text'
                  placeholder='Tier Name (e.g. VIP)'
                  value={tier.name}
                  onChange={(e) =>
                    handleTierChange(index, 'name', e.target.value)
                  }
                  className='border dark:border-gray-600 px-3 py-2 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white'
                />
                <input
                  type='number'
                  placeholder='Original Price'
                  value={tier.originalPrice}
                  onChange={(e) =>
                    handleTierChange(index, 'originalPrice', e.target.value)
                  }
                  className='border dark:border-gray-600 px-3 py-2 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white'
                />
                <input
                  type='number'
                  placeholder='Discounted Price'
                  value={tier.discountedPrice}
                  onChange={(e) =>
                    handleTierChange(index, 'discountedPrice', e.target.value)
                  }
                  className='border dark:border-gray-600 px-3 py-2 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white'
                />
                <div className='flex gap-2'>
                  <input
                    type='number'
                    placeholder='Quantity'
                    value={tier.quantity}
                    onChange={(e) =>
                      handleTierChange(index, 'quantity', e.target.value)
                    }
                    className='w-full border dark:border-gray-600 px-3 py-2 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white'
                  />
                  {tiers.length > 1 && (
                    <button
                      type='button'
                      onClick={() => removeTier(index)}
                      className='text-red-500 hover:underline'
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type='button'
              onClick={addTier}
              className='mt-2 text-blue-600 hover:underline text-sm'
            >
              + Add Another Tier
            </button>
          </div>

          <button
            type='submit'
            className='bg-primary-main text-white px-6 py-2 rounded-md hover:bg-primary-dark transition'
          >
            Create Ticket
          </button>
        </form>
      </div>
    </main>
  );
};

export default AddTicket;
