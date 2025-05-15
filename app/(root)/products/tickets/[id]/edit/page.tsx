'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import PageHeading from '@/components/PageHeading';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

// Simulated fetch function to get ticket by ID
const fetchTicketById = async (id: string) => {
  // Replace with real fetch from API
  return {
    eventTitle: 'Sample Event',
    description: '<p>This is a sample event description.</p>',
    isOnline: true,
    isOneDay: false,
    eventImageUrl:
      'https://softwarelab.org/wp-content/uploads/URL-Types.jpg.webp',
    tiers: [
      {
        name: 'Regular',
        originalPrice: '50',
        discountedPrice: '40',
        quantity: '100',
      },
      {
        name: 'VIP',
        originalPrice: '100',
        discountedPrice: '80',
        quantity: '50',
      },
    ],
    eventDate: '', // empty if isOneDay=false
    startDate: '2025-06-01',
    endDate: '2025-06-03',
    eventTime: '18:00',
  };
};

interface Tier {
  name: string;
  originalPrice: string;
  discountedPrice: string;
  quantity: string;
}

const EditTicket = ({ ticketId }: { ticketId: string }) => {
  const [eventTitle, setEventTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [isOneDay, setIsOneDay] = useState(true);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Dates and time
  const [eventDate, setEventDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [eventTime, setEventTime] = useState('');

  // Load existing ticket data on mount
  useEffect(() => {
    async function loadTicket() {
      const ticket = await fetchTicketById(ticketId);

      setEventTitle(ticket.eventTitle);
      setDescription(ticket.description);
      setIsOnline(ticket.isOnline);
      setIsOneDay(ticket.isOneDay);
      setTiers(ticket.tiers);
      setEventDate(ticket.eventDate);
      setStartDate(ticket.startDate);
      setEndDate(ticket.endDate);
      setEventTime(ticket.eventTime);

      if (ticket.eventImageUrl) {
        setImagePreviewUrl(ticket.eventImageUrl);
      }
    }

    loadTicket();
  }, [ticketId]);

  // Handle image upload + preview
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEventImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  // Remove image preview and file
  const removeImage = () => {
    setEventImage(null);
    setImagePreviewUrl(null);
  };

  // Handle tier change
  const handleTierChange = (index: number, field: string, value: string) => {
    const updatedTiers = [...tiers];
    updatedTiers[index][field as keyof Tier] = value;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit updated ticket data
    console.log('Updated ticket data:', {
      eventTitle,
      description,
      isOnline,
      isOneDay,
      tiers,
      eventImage,
      eventDate,
      startDate,
      endDate,
      eventTime,
    });
    alert('Ticket updated! (Implement API call)');
  };

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Edit Ticket'
          enableBreadCrumb={true}
          layer2='Products'
          layer3='Tickets'
          layer4='Edit Ticket'
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
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
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
              <div className='mt-4 relative'>
                <p className='text-sm text-gray-600 dark:text-gray-300 mb-2'>
                  Preview:
                </p>
                <img
                  src={imagePreviewUrl}
                  alt='Event Preview'
                  className='max-h-64 rounded-md border dark:border-gray-600'
                />
                <button
                  type='button'
                  onClick={removeImage}
                  className='absolute top-5 left-0 bg-red-600 text-white  px-2 rounded-full hover:bg-red-700'
                  aria-label='Remove Image'
                >
                  ×
                </button>
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
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
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
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
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
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
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
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
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
                    className='border dark:border-gray-600 px-3 py-2 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white w-full'
                  />
                  <button
                    type='button'
                    onClick={() => removeTier(index)}
                    className='text-red-600 hover:text-red-700 font-bold px-2 rounded'
                    aria-label={`Remove tier ${tier.name || index + 1}`}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}

            <div className='flex justify-end'>
              <button
                type='button'
                onClick={addTier}
                className='bg-primary-main text-white px-4 py-2 rounded-md hover:bg-primary-dark'
              >
                Add Tier
              </button>
            </div>
          </div>

          <div className='mt-6'>
            <button
              type='submit'
              className='bg-primary-main text-white px-6 py-3 rounded-md hover:bg-primary-dark'
            >
              Update Ticket
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditTicket;
