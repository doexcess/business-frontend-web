'use client';

import Input from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import ThemeDiv from '@/components/ui/ThemeDiv';
import React, { useState, useRef } from 'react';
import useProductCategory from '@/hooks/page/useProductCategory';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CreateCourseProps,
  CreateCourseSchema,
} from '@/lib/schema/product.schema';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { uploadImage } from '@/redux/slices/multimediaSlice';
import useOrg from '@/hooks/page/useOrg';
import { createCourse } from '@/redux/slices/courseSlice';
import { setOnboardingStep } from '@/redux/slices/orgSlice';
import { Globe } from 'lucide-react';

const defaultValue = {
  title: '',
  slug: uuidv4().split('-')[0],
  description: '',
  multimedia_id: '',
  price: 0,
  original_price: 0,
  category_id: '',
};

const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL; // change to your actual base URL

const AddCourseForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { categories } = useProductCategory();
  const { org } = useSelector((state: RootState) => state.org);

  const [body, setBody] = useState<CreateCourseProps>({ ...defaultValue });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBody((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

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
        uploadImage({
          form_data: formData,
          business_id: org?.id,
          onUploadProgress: (event) => {
            const percent = Math.round(
              (event.loaded * 100) / (event.total || 1)
            );
            setUploadProgress(percent);
          },
        })
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
      setUploadProgress(0);
      setUploadingImage(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setIsSubmitting(true);
      const { error, value } = CreateCourseSchema.validate(body);
      if (error) throw new Error(error.details[0].message);

      // Submit logic here
      const response: any = await dispatch(
        createCourse({
          credentials: {
            ...body,
            price: +body.price!,
            original_price: +body.original_price!,
          },
          business_id: org?.id!,
        })
      );

      if (response.type === 'product-course-crud/create/rejected') {
        throw new Error(response.payload.message);
      }

      if (org?.onboarding_status?.current_step! < 4) {
        // Update the onboarding current step
        dispatch(setOnboardingStep(4));
      }

      toast.success('Course created successfully!');
      router.push(`/products/courses/${response.payload.data.id}/contents`);
    } catch (error: any) {
      console.error('Submission failed:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    body.title &&
    body.slug &&
    body.description &&
    body.category_id &&
    body.price &&
    body.original_price &&
    body.multimedia_id;

  return (
    <ThemeDiv className='mt-6 p-6'>
      <form className='space-y-6' onSubmit={handleSubmit}>
        <Input
          type='text'
          name='title'
          placeholder='Your Course Title Goes Here'
          className='w-full border rounded-md px-4 lg:text-2xl text-gray-600 dark:text-white placeholder-gray-400 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 font-bold'
          value={body.title}
          onChange={handleChange}
          required
        />

        {/* Upload Card */}
        <div
          className='relative flex flex-col items-center justify-center w-full sm:w-64 h-56 rounded-md bg-primary-main text-white p-4 text-center cursor-pointer overflow-hidden'
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt='Preview'
              className='w-full h-full object-cover rounded-md'
            />
          ) : (
            <>
              <img
                src='/icons/course/file.svg'
                alt='upload icon'
                className='mb-2 w-10 h-10'
              />
              <p className='font-medium'>Upload, Drag or drop image</p>
              <p className='text-xs'>
                Supported Format: png, jpeg. Max size is 5MB
              </p>
            </>
          )}

          {/* Uploading Overlay */}
          {uploadingImage && (
            <div className='absolute inset-0 bg-[#000]/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 px-4'>
              <p className='font-semibold text-white text-sm mb-3'>
                Uploading... {uploadProgress}%
              </p>
              <div className='w-full bg-white/30 rounded-full h-2'>
                <div
                  className='bg-white h-2 rounded-full transition-all duration-300'
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <input
            type='file'
            accept='image/png, image/jpeg'
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        {/* Category and Price Fields */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='text-sm font-medium mb-1 block'>
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
                {categories.map((category, index) => (
                  <SelectItem key={index} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className='text-sm font-medium mb-1 block'>
              Price <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              name='price'
              className='w-full rounded-md py-3'
              value={body.price!}
              onChange={handleChange}
              required
            />
            <p className='mt-2 text-xs'>Zero (0) represents a free product</p>
          </div>
          <div>
            <label className='text-sm font-medium mb-1 block'>
              Crossed-out Price (Optional)
            </label>
            <Input
              type='text'
              name='original_price'
              className='w-full rounded-md py-3'
              value={body.original_price!}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className='text-sm font-medium mb-1 block'>
              Shortlink <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <Globe className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
              <Input
                type='text'
                name='slug'
                className='w-full rounded-md pl-9'
                value={body.slug!}
                onChange={handleChange}
                required
              />
            </div>

            {/* Live preview */}
            {body.slug && (
              <p className='mt-2 text-sm '>
                Preview:{' '}
                <span className='text-primary-main dark:text-primary-faded font-medium'>
                  {baseUrl}/{body.slug}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className='text-sm font-medium mb-1 block'>
            Description <span className='text-red-500'>*</span>
          </label>
          <Textarea
            rows={3}
            name='description'
            placeholder='Enter Course Description'
            className='w-full rounded-md px-4 py-3'
            value={body.description}
            onChange={(e) =>
              setBody((prev) => ({ ...prev, description: e.target.value }))
            }
            required
          />
        </div>

        {/* Submit */}
        <div className='flex justify-end'>
          <button
            type='submit'
            disabled={!isFormValid || isSubmitting}
            className={cn(
              'text-white px-8 py-3 rounded-md font-medium',
              isFormValid
                ? 'bg-primary-main hover:bg-blue-700'
                : 'bg-primary-faded cursor-not-allowed'
            )}
          >
            {isSubmitting ? (
              <span className='flex items-center justify-center'>
                <LoadingIcon />
                Processing...
              </span>
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </form>
    </ThemeDiv>
  );
};

export default AddCourseForm;
