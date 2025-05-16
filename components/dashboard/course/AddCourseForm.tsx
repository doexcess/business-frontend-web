import Input from '@/components/ui/Input';
import Select from '@/components/Select';
import { Textarea } from '@/components/ui/textarea';
import ThemeDiv from '@/components/ui/ThemeDiv';
import React from 'react';

const AddCourseForm = () => {
  return (
    <ThemeDiv className='mt-6'>
      <form className='space-y-6'>
        <input
          type='text'
          placeholder='Your Course Title Goes Here'
          className='w-full border rounded-md px-4 text-2xl text-gray-600 dark:text-white placeholder-gray-400 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 font-bold'
        />

        {/* Upload Card */}
        <div className='flex flex-col items-center justify-center w-full sm:w-64 h-56  rounded-md bg-primary-main text-white p-4 text-center'>
          <img
            src='/icons/course/file.svg'
            alt='upload icon'
            className='mb-2 w-10 h-10'
          />
          <p className='font-medium'>Upload, Drag or drop document</p>
          <p className='text-xs'>
            Supported Format: png, jpeg. Max size is 5MB
          </p>
        </div>

        {/* Category and Price Fields */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='text-sm font-medium mb-1 block'>
              CATEGORY <span className='text-red-500'>*</span>
            </label>
            <Select
              name='category'
              className='w-full rounded-md'
              data={['UI/UX Design']}
            />
          </div>
          <div>
            <label className='text-sm font-medium mb-1 block'>
              PRICE <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              value='$300'
              className='w-full rounded-md py-3 '
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
            placeholder='Enter Course Description'
            className='w-full rounded-md px-4 py-3'
          />
        </div>

        {/* What Students Will Learn */}
        <div>
          <label className='text-sm font-medium mb-1 block'>
            WHAT STUDENTS WILL LEARN <span className='text-red-500'>*</span>
          </label>
          <Input
            type='text'
            placeholder='At the end of the course, student should be able to...'
            className='w-full rounded-md px-4 py-3 text-gray-700'
          />
        </div>

        <div className='flex justify-end'>
          <button
            type='submit'
            className='bg-primary-main hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium'
          >
            Continue
          </button>
        </div>
      </form>
    </ThemeDiv>
  );
};

export default AddCourseForm;
