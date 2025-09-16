'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import 'react-quill/dist/quill.snow.css';
import FileUploadCard from '@/components/dashboard/FileUploadCard';
import { useFileUploader } from '@/hooks/useFileUploader';
import useProductCategory from '@/hooks/page/useProductCategory';
import useDigitalProduct from '@/hooks/page/useDigitalProduct';
import {
  UpdateDigitalProductProps,
  updateDigitalProductSchema,
} from '@/lib/schema/product.schema';
import { cn, ProductStatus } from '@/lib/utils';
import { setOnboardingStep } from '@/redux/slices/orgSlice';
import { updateDigitialProduct } from '@/redux/slices/digitalProductSlice';
import { AppDispatch, RootState } from '@/redux/store';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';

const ReactQuillEditor = dynamic(() => import('react-quill'), { ssr: false });

const defaultValue: UpdateDigitalProductProps = {
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

const EditDigitalProductForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { categories } = useProductCategory();
  const { digital_product } = useSelector(
    (state: RootState) => state.digitalProduct
  );
  const { org } = useSelector((state: RootState) => state.org);

  const [formData, setFormData] =
    useState<UpdateDigitalProductProps>(defaultValue);
  const [errors, setErrors] = useState<Partial<UpdateDigitalProductProps>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageUploader = useFileUploader({ type: 'image', maxSizeMB: 5 });
  const zipUploader = useFileUploader({ type: 'zip', maxSizeMB: 100 });

  const [previewImage, setPreviewImage] = useState('');
  const [previewZipImage, setPreviewZipImage] = useState('');
  const [previewZipName, setPreviewZipName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = { ...formData, keywords: formData.keywords || undefined };

    try {
      setIsSubmitting(true);
      const { error } = updateDigitalProductSchema.validate(input);
      if (error) throw new Error(error.details[0].message);

      const response: any = await dispatch(
        updateDigitialProduct({
          id: digital_product?.id!,
          credentials: input,
          business_id: org?.id!,
        })
      );

      if (response.type.includes('/rejected'))
        throw new Error(response.payload.message);

      if (org?.onboarding_status?.current_step! < 5) {
        dispatch(setOnboardingStep(5));
      }

      toast.success('Digital product saved successfully!');
      router.push(`/products/digital-products`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (digital_product) {
      setFormData({
        title: digital_product.title,
        description: digital_product.description,
        price: +digital_product.price,
        original_price: +digital_product.original_price!,
        category_id: digital_product.category?.id,
        status: digital_product.status,
        keywords: digital_product?.keywords!,
        multimedia_id: digital_product?.multimedia?.id,
        multimedia_zip_id: digital_product?.zip_file?.id,
      });
      setPreviewImage(digital_product.multimedia?.url);
      setPreviewZipImage(digital_product.zip_file && '/icons/zip.png');
      setPreviewZipName(digital_product.zip_file?.url);
    }
  }, [digital_product, previewImage, previewZipImage, previewZipName]);

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
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={cn(errors.title && 'border-red-500')}
        />
      </div>

      {/* Description */}
      <div>
        <label className='block text-sm font-medium mb-1'>
          Description <span className='text-red-500'>*</span>
        </label>
        <div className='quill-container'>
          <ReactQuillEditor
            value={formData.description}
            onChange={(val) => setFormData({ ...formData, description: val })}
            className='dark:text-white'
            theme='snow'
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className='block text-sm font-medium mb-1'>
          Category <span className='text-red-500'>*</span>
        </label>
        <Select
          value={formData.category_id}
          onValueChange={(val) =>
            setFormData({ ...formData, category_id: val })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='Select category' />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        {/* Price */}
        <div>
          <label className='block text-sm font-medium mb-1'>
            Price (NGN) <span className='text-red-500'>*</span>
          </label>
          <Input
            type='text'
            name='text'
            placeholder='Enter price'
            value={formData.price || ''}
            onChange={(e) =>
              setFormData({ ...formData, price: +e.target.value })
            }
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
            Crossed-out Price (NGN) (Optional)
          </label>
          <Input
            type='text'
            name='original_price'
            placeholder='Enter crossed-out price'
            value={formData.original_price || ''}
            onChange={(e) =>
              setFormData({ ...formData, original_price: +e.target.value })
            }
            min='0'
            step='0.01'
            className={cn(errors.original_price && 'border-red-500')}
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
            onChange={(e) =>
              setFormData({ ...formData, keywords: e.target.value })
            }
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

      {/* Uploaders */}
      <FileUploadCard
        preview={imageUploader.preview || previewImage}
        uploading={imageUploader.uploading}
        accept='image/png,image/jpeg'
        onFileSelect={(f) =>
          imageUploader.handleUpload(f, (id) =>
            setFormData({ ...formData, multimedia_id: id })
          )
        }
        placeholder={{
          icon: '/icons/course/file.svg',
          title: 'Upload, Drag or Drop Image',
          description: 'Supported: png, jpeg. Max 5MB',
        }}
      />

      <FileUploadCard
        preview={zipUploader.preview || previewZipImage}
        fileName={zipUploader.fileName || previewZipName}
        uploading={zipUploader.uploading}
        accept='.zip'
        onFileSelect={(f) =>
          zipUploader.handleUpload(f, (id) =>
            setFormData({ ...formData, multimedia_zip_id: id })
          )
        }
        placeholder={{
          icon: '/icons/zip.png',
          title: 'Upload, Drag or Drop ZIP File',
          description: 'Format: .zip. Max 100MB',
        }}
      />

      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <LoadingIcon /> Saving...
          </>
        ) : (
          'Save Product'
        )}
      </Button>
    </form>
  );
};

export default EditDigitalProductForm;
