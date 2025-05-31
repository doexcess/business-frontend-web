'use client';

import React, { useState } from 'react';
import ThemeDiv from '@/components/ui/ThemeDiv';

const AddSubscriptionPlanForm = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    business_id: '',
    subscription_plan_id: '',
    price: '',
    period: '',
    title: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Final Submission Data:', formData);
    // TODO: Submit to backend here
  };

  return (
    <ThemeDiv>
      <form
        onSubmit={handleSubmit}
        className='bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6 max-w-xl mx-auto'
      >
        <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
          {`Step ${step}: ${
            step === 1 ? 'Basic Info' : step === 2 ? 'Plan Details' : 'Title'
          }`}
        </h2>

        {step === 1 && (
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Name
              </label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                placeholder='Premium Club'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Business ID
              </label>
              <input
                type='text'
                name='business_id'
                value={formData.business_id}
                onChange={handleChange}
                className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                placeholder='UUID'
                required
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Subscription Plan ID
              </label>
              <input
                type='text'
                name='subscription_plan_id'
                value={formData.subscription_plan_id}
                onChange={handleChange}
                className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                placeholder='UUID'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Price
              </label>
              <input
                type='number'
                name='price'
                value={formData.price}
                onChange={handleChange}
                className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                placeholder='0.0'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Period
              </label>
              <select
                name='period'
                value={formData.period}
                onChange={handleChange}
                className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                required
              >
                <option value=''>Select</option>
                <option value='free'>Free</option>
                <option value='monthly'>Monthly</option>
                <option value='yearly'>Yearly</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Subscription Plan ID
              </label>
              <input
                type='text'
                name='subscription_plan_id'
                value={formData.subscription_plan_id}
                onChange={handleChange}
                className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Title
              </label>
              <input
                type='text'
                name='title'
                value={formData.title}
                onChange={handleChange}
                className='mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                placeholder='Premium Member'
                required
              />
            </div>
          </div>
        )}

        <div className='flex justify-between pt-4'>
          {step > 1 ? (
            <button
              type='button'
              onClick={handleBack}
              className='px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white'
            >
              Back
            </button>
          ) : (
            <div />
          )}
          {step < 3 ? (
            <button
              type='button'
              onClick={handleNext}
              className='px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700'
            >
              Next
            </button>
          ) : (
            <button
              type='submit'
              className='px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700'
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </ThemeDiv>
  );
};

export default AddSubscriptionPlanForm;
