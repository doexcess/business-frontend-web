'use client';

import XIcon from '@/components/ui/icons/XIcon';
import Input from '@/components/ui/Input';
import { AppDispatch, RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import useProductCategory from '@/hooks/page/useProductCategory';
import {
  CreateTicketProps,
  createTicketSchema,
  TicketTierProps,
} from '@/lib/schema/product.schema';
import { toast } from 'react-hot-toast';
import { uploadImage } from '@/redux/slices/multimediaSlice';
import { cn, EventType, ProductStatus, TicketTierStatus } from '@/lib/utils';
import { createTicket } from '@/redux/slices/ticketSlice';
import { SelectItem } from '@/components/ui/select';
import { SelectContent } from '@/components/ui/select';
import { SelectTrigger, SelectValue } from '@/components/ui/select';
import { Select } from '@/components/ui/select';
import moment from 'moment-timezone';
import { Textarea } from '@/components/ui/textarea';

const defaultValue: CreateTicketProps = {
  title: '',
  description: '',
  keywords: '',
  metadata: '',
  category_id: '',
  status: null,
  multimedia_id: '',
  event_time: '',
  event_start_date: null,
  event_end_date: null,
  event_location: '',
  event_type: null,
  auth_details: '',
  ticket_tiers: [
    {
      name: '',
      amount: null,
      original_amount: null,
      quantity: 1,
    },
  ],
};

const AddTicketForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { categories } = useProductCategory();
  const { org } = useSelector((state: RootState) => state.org);

  const [deleteTicketTierOpenModal, setDeleteTicketTierOpenModal] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [body, setBody] = useState<CreateTicketProps>({ ...defaultValue });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [tierIndex, setTierIndex] = useState<number>();
  const [tier, setTier] = useState<TicketTierProps>();

  const [isOneDayEvent, setIsOneDayEvent] = useState(
    body.event_start_date === body.event_end_date
  );

  // Sync body state when toggling
  useEffect(() => {
    if (isOneDayEvent && body.event_start_date) {
      setBody((prev) => ({
        ...prev,
        event_end_date: prev.event_start_date,
      }));
    }
  }, [isOneDayEvent, body.event_start_date]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBody((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload + preview
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return toast.error('Only PNG and JPEG images are allowed');
    }

    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Image size should be less than 5MB');
    }

    setUploadingImage(true);

    try {
      // Simulate upload
      const formData = new FormData();
      formData.append('image', file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const response: any = await dispatch(
        uploadImage({ form_data: formData, business_id: org?.id })
      );

      if (response.type === 'multimedia-upload/image/rejected') {
        throw new Error(response.payload.message);
      }

      setBody((prev) => ({
        ...prev,
        multimedia_id: response.payload.multimedia.id,
      }));

      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  // Remove image preview and file
  const removeImage = () => {
    setBody((prev) => ({
      ...prev,
      multimedia_id: '',
    }));
    setImagePreview(null);
  };

  // Handle tier change
  const handleTierChange = (index: number, field: string, value: string) => {
    const updatedTiers = [...body.ticket_tiers];
    const tier = updatedTiers[index] as TicketTierProps;
    const numericFields = [
      'amount',
      'original_amount',
      'quantity',
      'remaining_quantity',
      'max_per_purchase',
    ];
    if (numericFields.includes(field)) {
      (tier as any)[field] = +value;
    } else {
      (tier as any)[field] = value;
    }
    setBody((prev) => ({
      ...prev,
      ticket_tiers: updatedTiers,
    }));
  };

  const addTier = () => {
    setBody((prev) => ({
      ...prev,
      ticket_tiers: [
        ...prev.ticket_tiers,
        {
          name: '',
          amount: null,
          original_amount: null,
          description: undefined,
          quantity: undefined,
          remaining_quantity: undefined,
          max_per_purchase: undefined,
          default_view: false,
          status: TicketTierStatus.OPEN,
        },
      ],
    }));
  };

  const removeTier = (index: number) => {
    setTierIndex(index);
    const tier = body.ticket_tiers.find((_, i) => i === index);
    setTier(tier);
    setDeleteTicketTierOpenModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    try {
      setIsSubmitting(true);

      // Filter purchased ticket
      const filtered_ticket_tiers = body.ticket_tiers.map((tier) => {
        delete tier.purchased_tickets;
        return tier;
      });

      const { error, value } = createTicketSchema.validate(body);
      if (error) throw new Error(error.details[0].message);

      // Submit logic here
      const response: any = await dispatch(
        createTicket({
          credentials: {
            ...body,
            ticket_tiers: filtered_ticket_tiers.map((tier) => ({
              ...tier,
              amount: +tier.amount!,
              original_amount: +tier.original_amount!,
            })),
          },
          business_id: org?.id!,
        })
      );

      if (response.type === 'product-ticket-crud/rejected') {
        throw new Error(response.payload.message);
      }

      toast.success('Ticket created successfully!');
      router.push(`/products/tickets`);
    } catch (error: any) {
      console.error('Submission failed:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    body.title &&
    body.description &&
    body.category_id &&
    body.event_end_date &&
    body.event_start_date &&
    body.multimedia_id &&
    body.event_location &&
    body.event_type &&
    body.auth_details &&
    body.ticket_tiers.length > 0;

  const renderDateField = (label: string, name: string, value: string) => (
    <div>
      <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
        {label}
      </label>
      <Input
        type='date'
        name={name}
        value={value}
        onChange={handleChange}
        required={name === 'event_start_date'}
      />
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-white dark:bg-gray-800 rounded-md shadow p-6 space-y-6'
    >
      <div>
        <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
          Event Title
        </label>
        <Input
          type='text'
          name='title'
          value={body.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
          Event Location
        </label>
        <Input
          type='text'
          name='event_location'
          value={body.event_location}
          onChange={handleChange}
          required
        />
      </div>

      {/* Category*/}
      <div>
        <label className='text-sm font-medium mb-1 block text-gray-700 dark:text-white'>
          Category <span className='text-red-500'>*</span>
        </label>
        <Select
          value={body.category_id}
          onValueChange={(value) =>
            setBody((prev) => ({ ...prev, category_id: value }))
          }
          required
        >
          <SelectTrigger id='category' className='w-full'>
            <SelectValue placeholder='Select your category' />
          </SelectTrigger>
          <SelectContent>
            {categories.map(
              (category: { id: string; name: string }, index: number) => (
                <SelectItem key={index} value={category.id}>
                  {category.name}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
          Event Description
        </label>
        <div className='quill-container'>
          <ReactQuill
            value={body.description}
            onChange={(value: string) =>
              setBody((prev) => ({ ...prev, description: value }))
            }
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
              checked={body.event_type === EventType.ONLINE}
              onChange={() =>
                setBody((prev) => ({ ...prev, event_type: EventType.ONLINE }))
              }
            />
            Online
          </label>
          <label className='flex items-center gap-2 text-gray-700 dark:text-white'>
            <input
              type='radio'
              checked={body.event_type === EventType.PHYSICAL}
              onChange={() =>
                setBody((prev) => ({
                  ...prev,
                  event_type: EventType.PHYSICAL,
                }))
              }
            />
            Physical
          </label>
          <label className='flex items-center gap-2 text-gray-700 dark:text-white'>
            <input
              type='radio'
              checked={body.event_type === EventType.HYBRID}
              onChange={() =>
                setBody((prev) => ({
                  ...prev,
                  event_type: EventType.HYBRID,
                }))
              }
            />
            Hybrid
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
          onChange={(e) => {
            if (e.target.files) {
              handleImageUpload(e.target.files[0]);
            }
          }}
          className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-primary-main file:text-white hover:file:bg-primary-dark'
        />
        {imagePreview && (
          <div className='mt-4 relative'>
            <p className='text-sm text-gray-600 dark:text-gray-300 mb-2'>
              Preview:
            </p>
            <img
              src={imagePreview}
              alt='Event Preview'
              className='max-h-64 rounded-md border dark:border-gray-600'
            />
            <button
              type='button'
              onClick={removeImage}
              className='absolute top-5 left-0 bg-red-600 text-white  px-2 rounded-full hover:bg-red-700'
              aria-label='Remove Image'
            >
              <XIcon />
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
              name='one-day-event'
              checked={isOneDayEvent}
              onChange={() => setIsOneDayEvent(true)}
            />
            Yes
          </label>
          <label className='flex items-center gap-2 text-gray-700 dark:text-white'>
            <input
              type='radio'
              name='one-day-event'
              checked={!isOneDayEvent}
              onChange={() => setIsOneDayEvent(false)}
            />
            No
          </label>
        </div>
      </div>

      {isOneDayEvent ? (
        renderDateField(
          'Event Date',
          'event_start_date',
          moment(body.event_start_date).format('YYYY-MM-DD')
        )
      ) : (
        <div className='grid md:grid-cols-2 gap-4'>
          {renderDateField(
            'Start Date',
            'event_start_date',
            moment(body.event_start_date).format('YYYY-MM-DD')
          )}
          {renderDateField(
            'End Date',
            'event_end_date',
            moment(body.event_end_date).format('YYYY-MM-DD')
          )}
        </div>
      )}

      <div>
        <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
          Event Time
        </label>
        <Input
          type='time'
          name='event_time'
          value={body.event_time}
          onChange={handleChange}
          required
        />
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <div>
          <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
            Keywords
          </label>
          <Input
            type='text'
            name='keywords'
            value={body.keywords}
            onChange={handleChange}
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className='font-medium mb-1 block text-gray-700 dark:text-white'>
            Status <span className='text-red-500'>*</span>
          </label>
          <Select
            value={body.status!}
            onValueChange={(value) =>
              setBody((prev) => ({ ...prev, status: value as any }))
            }
            required
          >
            <SelectTrigger id='status' className='w-full'>
              <SelectValue placeholder='Select your status' />
            </SelectTrigger>
            <SelectContent>
              {[ProductStatus.DRAFT, ProductStatus.PUBLISHED].map(
                (status, index) => (
                  <SelectItem key={index} value={status}>
                    {status}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
          What do you want to them to know after ticket payments?
        </label>
        <Textarea
          name='auth_details'
          value={body.auth_details}
          onChange={handleChange as any}
          required
        />
      </div>

      <div className='space-y-4'>
        <h3 className='text-lg font-semibold text-primary-main dark:text-primary-faded'>
          Ticket Tiers
        </h3>

        {body.ticket_tiers.map((tier, index) => (
          <div key={index} className='grid md:grid-cols-4 gap-4 items-center'>
            <Input
              type='text'
              placeholder='Tier Name (e.g. VIP)'
              value={tier.name}
              onChange={(e) => handleTierChange(index, 'name', e.target.value)}
            />
            <Input
              type='number'
              placeholder='Original Price'
              value={tier.original_amount!}
              onChange={(e) =>
                handleTierChange(index, 'original_amount', e.target.value)
              }
            />
            <Input
              type='number'
              placeholder='Discounted Price'
              value={tier.amount!}
              onChange={(e) =>
                handleTierChange(index, 'amount', e.target.value)
              }
            />
            <div className='flex gap-2'>
              <Input
                type='number'
                placeholder='Quantity'
                value={tier.quantity!}
                onChange={(e) =>
                  handleTierChange(index, 'quantity', e.target.value)
                }
              />
              {/* {tier.purchased_tickets?.length === 0 && ( */}
              <button
                type='button'
                onClick={() => removeTier(index)}
                className={cn(
                  'text-red-600 hover:text-red-700 font-bold px-2 rounded',
                  tier.purchased_tickets!?.length > 0 &&
                    'dark:text-red-900 dak:hover:text-red-900 text-red-200 hover:text-red-200'
                )}
                aria-label={`Remove tier ${tier.name || index + 1}`}
                disabled={tier.purchased_tickets!?.length > 0}
                title={
                  tier.purchased_tickets!?.length > 0
                    ? 'This ticket tier has once been purchased'
                    : ''
                }
              >
                <XIcon />
              </button>
              {/* )} */}
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
          className='bg-primary-main text-white px-6 py-2 rounded-md hover:bg-primary-dark transition'
        >
          Create Ticket
        </button>
      </div>
    </form>
  );
};

export default AddTicketForm;
