'use client';

import React, { useState, useRef } from 'react';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  CreateDigitalProductProps,
  createDigitalProductSchema,
} from '@/lib/schema/product.schema';
import { cn, ProductStatus } from '@/lib/utils';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { uploadImage, uploadRawDocument } from '@/redux/slices/multimediaSlice';
import useProductCategory from '@/hooks/page/useProductCategory';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { createDigitalProduct } from '@/redux/slices/digitalProductSlice';
import { setOnboardingStep } from '@/redux/slices/orgSlice';
import { Badge } from '@/components/ui/badge';

const defaultValue: CreateDigitalProductProps = {
  title: '',
  description: '',
  category_id: '',
  multimedia_id: '',
  multimedia_zip_id: '',
  status: ProductStatus.PUBLISHED,
  price: 0,
  original_price: 0,
  keywords: '',
};

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuillEditor = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

const AddDigitalProductForm = () => {
  const [formData, setFormData] =
    useState<CreateDigitalProductProps>(defaultValue);
  const [errors, setErrors] = useState<Partial<CreateDigitalProductProps>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [zipFilePreview, setZipFilePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingZipFile, setUploadingZipFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const zipFileInputRef = useRef<HTMLInputElement>(null);
  const [zipFileName, setZipFileName] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { categories } = useProductCategory();
  const { org } = useSelector((state: RootState) => state.org);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'price' || name === 'original_price'
          ? Number(value) || 0
          : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof CreateDigitalProductProps]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user selects
    if (errors[name as keyof CreateDigitalProductProps]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleImageUpload = async (file: File): Promise<void> => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PNG and JPEG images are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);

    try {
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

      setFormData((prev) => ({
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

  const handleZipFileUpload = async (file: File): Promise<void> => {
    if (!file) return;

    // ✅ Allow only ZIP files
    const allowedTypes = ['application/zip', 'application/x-zip-compressed'];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.zip')) {
      toast.error('Only .zip files are allowed');
      return;
    }

    // ✅ Check file size (example: max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast.error('File size should be less than 100MB');
      return;
    }

    setUploadingZipFile(true);

    try {
      const formData = new FormData();
      formData.append('document', file);

      // Preview not useful for ZIPs (remove or show filename instead)
      setZipFilePreview('/icons/zip.png');
      setZipFileName(file.name);

      const response: any = await dispatch(
        uploadRawDocument({ form_data: formData, business_id: org?.id })
      );

      if (response.type === 'multimedia-upload/raw-document/rejected') {
        throw new Error(response.payload.message);
      }

      setFormData((prev) => ({
        ...prev,
        multimedia_zip_id: response.payload.multimedia.id,
      }));

      toast.success('ZIP file uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload ZIP file');
    } finally {
      setUploadingZipFile(false);
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

  const handleZipFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleZipFileUpload(file);
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      multimedia_id: '',
    }));
    setImagePreview(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      multimedia_id: '',
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateDigitalProductProps> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.multimedia_id) {
      newErrors.multimedia_id = 'Product image is required';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setIsSubmitting(true);

      const input = {
        ...formData,
        keywords: formData.keywords ? formData.keywords : undefined,
      };

      const { error, value } = createDigitalProductSchema.validate(input);
      if (error) throw new Error(error.details[0].message);

      const response: any = await dispatch(
        createDigitalProduct({
          credentials: {
            ...input,
          },
          business_id: org?.id!,
        })
      );

      if (response.type === 'product-digital-crud/create/rejected') {
        throw new Error(response.payload.message);
      }

      if (org?.onboarding_status?.current_step! < 5) {
        // Update the onboarding current step
        dispatch(setOnboardingStep(5));
      }

      toast.success('Digital product created successfully!');
      router.push(`/products/digital-products`);
    } catch (error: any) {
      console.error('Submission failed:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.title &&
    formData.description &&
    formData.category_id &&
    formData.multimedia_id &&
    formData.multimedia_zip_id &&
    formData.status &&
    formData.price;

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-white dark:bg-gray-800 dark:text-white rounded-md shadow p-6 space-y-6'
    >
      {/* Title */}
      <div>
        <label className='block text-sm font-medium mb-1'>
          Title <span className='text-red-500'>*</span>
        </label>
        <Input
          type='text'
          name='title'
          placeholder='Enter title'
          value={formData.title}
          onChange={handleInputChange}
          className={cn(
            'lg:text-2xl font-bold',
            errors.title && 'border-red-500'
          )}
          required
        />
        {errors.title && (
          <p className='text-red-500 text-xs mt-1'>{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className='block text-sm font-medium mb-1'>
          Description <span className='text-red-500'>*</span>
        </label>
        <div className='quill-container'>
          <ReactQuillEditor
            value={formData.description}
            onChange={(value: string) =>
              setFormData((prev) => ({ ...prev, description: value }))
            }
            className='dark:text-white'
            theme='snow'
          />
        </div>
        {errors.description && (
          <p className='text-red-500 text-xs mt-1'>{errors.description}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className='block text-sm font-medium mb-1'>
          Category <span className='text-red-500'>*</span>
        </label>
        <Select
          value={formData.category_id}
          onValueChange={(value) => handleSelectChange('category_id', value)}
        >
          <SelectTrigger className={cn(errors.category_id && 'border-red-500')}>
            <SelectValue placeholder='Select a category' />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category_id && (
          <p className='text-red-500 text-xs mt-1'>{errors.category_id}</p>
        )}
      </div>

      <div className='grid grid-cols-2 gap-2'>
        {/* Price */}
        <div>
          <label className='block text-sm font-medium mb-1'>
            Price (NGN) <span className='text-red-500'>*</span>
          </label>
          <Input
            type='number'
            name='price'
            placeholder='Enter price'
            value={formData.price || ''}
            onChange={handleInputChange}
            min='0'
            step='0.01'
            className={cn(errors.price && 'border-red-500')}
            required
          />
          {errors.price && (
            <p className='text-red-500 text-xs mt-1'>{errors.price}</p>
          )}
        </div>

        {/* Crossed-out price */}
        <div>
          <label className='block text-sm font-medium mb-1'>
            Crossed-out price (NGN) (Optional)
          </label>
          <Input
            type='number'
            name='original_price'
            placeholder='Enter striked-out price'
            value={formData.original_price || ''}
            onChange={handleInputChange}
            min='0'
            step='0.01'
            className={cn(errors.original_price && 'border-red-500')}
            required
          />
          {errors.original_price && (
            <p className='text-red-500 text-xs mt-1'>{errors.original_price}</p>
          )}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        {/* Keywords */}
        <div>
          <label className='block text-sm font-medium mb-1'>
            Keywords (optional)
          </label>
          <Input
            type='text'
            name='keywords'
            placeholder='Enter keywords (comma separated)'
            value={formData.keywords || ''}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className='font-medium text-sm mb-1 block text-gray-700 dark:text-white'>
            Status <span className='text-red-500'>*</span>
          </label>
          <Select
            value={formData.status!}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, status: value as any }))
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

      {/* Product Image */}
      <div>
        <label className='block text-sm font-medium mb-2'>
          Product Image <span className='text-red-500'>*</span>
        </label>

        {/* Upload Card */}
        <div
          className='relative flex flex-col items-center justify-center w-full sm:w-72 h-56 rounded-md bg-primary-main text-white p-4 text-center cursor-pointer overflow-hidden'
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
      </div>

      {/* Digital product (zipped file) */}
      <div>
        <label className='block text-sm font-medium mb-2'>
          Upload Digital Product (ZIP) <span className='text-red-500'>*</span>
        </label>

        {/* Upload Card */}
        <div
          className='relative flex flex-col items-center justify-center w-full sm:w-72 h-56 rounded-xl border-2 border-dashed border-primary-main dark:border-primary-faded bg-primary-main/10 text-primary-main dark:text-primary-faded p-4 text-center cursor-pointer hover:bg-primary-main/20 transition-all duration-300'
          onClick={() => zipFileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {zipFilePreview ? (
            <>
              <img
                src={zipFilePreview}
                alt='Preview'
                className='w-full h-full object-cover rounded-md'
              />
              {zipFileName && <Badge>{zipFileName}</Badge>}
            </>
          ) : (
            <>
              <img
                src='/icons/zip.png'
                alt='upload icon'
                className='mb-3 w-12 h-12 opacity-80'
              />
              <p className='font-semibold text-sm'>
                Upload, drag or drop your zipped file
              </p>
              <p className='text-xs mt-1'>
                Recommended Format: <span className='font-medium'>.zip</span>{' '}
                <br />
                Max size: 100MB
              </p>
            </>
          )}

          {/* Uploading Overlay */}
          {uploadingZipFile && (
            <div className='absolute inset-0 bg-primary-main/90 backdrop-blur-sm flex flex-col justify-center items-center z-10 px-4 rounded-xl'>
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
            accept='.zip'
            hidden
            ref={zipFileInputRef}
            onChange={handleZipFileChange}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className='flex justify-end space-x-3 pt-4'>
        <Button type='button' variant='outline' disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          type='submit'
          variant='primary'
          disabled={isSubmitting || !isFormValid}
          className='min-w-[120px]'
        >
          {isSubmitting ? (
            <>
              <LoadingIcon className='w-4 h-4 mr-2' />
              Processing...
            </>
          ) : (
            'Create Product'
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddDigitalProductForm;
