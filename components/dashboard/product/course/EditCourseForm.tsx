'use client';

import Input from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import ThemeDiv from '@/components/ui/ThemeDiv';
import React, { useState, useRef, useEffect, use } from 'react';
import useProductCategory from '@/hooks/page/useProductCategory';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  UpdateCourseProps,
  UpdateCourseSchema,
} from '@/lib/schema/product.schema';
import { cn } from '@/lib/utils';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { uploadImage } from '@/redux/slices/multimediaSlice';
import { updateCourse } from '@/redux/slices/courseSlice';

const defaultValue = {
  title: '',
  description: '',
  multimedia_id: '',
  price: null,
  category_id: '',
};

const EditCourseForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { categories } = useProductCategory();
  const { org } = useSelector((state: RootState) => state.org);
  const { course } = useSelector((state: RootState) => state.course);

  const [body, setBody] = useState<UpdateCourseProps>({ ...defaultValue });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setIsSubmitting(true);
      const { error, value } = UpdateCourseSchema.validate(body);
      if (error) throw new Error(error.details[0].message);

      // Submit logic here
      const response: any = await dispatch(
        updateCourse({
          id: course?.id!,
          credentials: { ...body, price: +body.price! },
          business_id: org?.id!,
        })
      );

      if (response.type === 'product-course-crud/:id/update/rejected') {
        throw new Error(response.payload.message);
      }

      toast.success('Course updated successfully!');
      router.push(`/products/courses/${course?.id}/contents`);
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
    body.price &&
    body.multimedia_id;

  // Update form state when course data is fetched
  useEffect(() => {
    if (course) {
      setBody({
        title: course.title || '',
        description: course.description || '',
        price: +course.price,
        multimedia_id: course.multimedia?.id,
        category_id: course.category.id,
      });
      setImagePreview(course.multimedia.url);
    }
  }, [course]);

  return (
    <ThemeDiv className='mt-6'>
      <form className='space-y-6' onSubmit={handleSubmit}>
        <Input
          type='text'
          name='title'
          placeholder='Your Course Title Goes Here'
          className='w-full border rounded-md px-4 text-2xl text-gray-600 dark:text-white placeholder-gray-400 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 font-bold'
          value={body.title}
          onChange={handleChange}
          required
        />

        {/* Upload Card */}
        <div
          className='flex flex-col items-center justify-center w-full sm:w-64 h-56 rounded-md bg-primary-main text-white p-4 text-center cursor-pointer relative'
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
              <p className='font-medium'>
                {uploadingImage ? 'Uploading...' : 'Upload, Drag or drop image'}
              </p>
              <p className='text-xs'>
                Supported Format: png, jpeg. Max size is 5MB
              </p>
            </>
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
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='text-sm font-medium mb-1 block'>
              CATEGORY <span className='text-red-500'>*</span>
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
                  (category: { id: string; name: string }, index) => (
                    <SelectItem key={index} value={category.id}>
                      {category.name}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className='text-sm font-medium mb-1 block'>
              PRICE <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              name='price'
              className='w-full rounded-md py-3'
              value={body.price!}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className='text-sm font-medium mb-1 block'>
            DESCRIPTION <span className='text-red-500'>*</span>
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

export default EditCourseForm;
