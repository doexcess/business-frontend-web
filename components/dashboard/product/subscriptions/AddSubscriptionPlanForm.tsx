'use client';

import React, { useState } from 'react';
import ThemeDiv from '@/components/ui/ThemeDiv';
import {
  createSubscriptionPlanSchema,
  CreateSubscriptionPlanProps,
} from '@/lib/schema/subscription.schema';
import { SubscriptionPeriod } from '@/lib/utils';
import Input from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/Button';

const CreateSubscriptionPlanForm = () => {
  const [formData, setFormData] = useState<CreateSubscriptionPlanProps>({
    name: '',
    business_id: '',
    creator_id: '',
    description: '',
    cover_image: '',
    subscription_plan_prices: [],
    subscription_plan_roles: [],
  });

  const [newPrice, setNewPrice] = useState({
    price: '',
    period: SubscriptionPeriod.MONTHLY,
  });
  const [newRole, setNewRole] = useState({ title: '', role_id: '' });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPrice = () => {
    const priceValue = parseFloat(newPrice.price);
    if (!isNaN(priceValue)) {
      setFormData((prev) => ({
        ...prev,
        subscription_plan_prices: [
          ...prev.subscription_plan_prices,
          {
            price: priceValue,
            period: newPrice.period,
            currency: 'NGN',
          },
        ],
      }));
      setNewPrice({ price: '', period: SubscriptionPeriod.MONTHLY });
    }
  };

  const handleAddRole = () => {
    if (newRole.title && newRole.role_id) {
      setFormData((prev) => ({
        ...prev,
        subscription_plan_roles: [
          ...prev.subscription_plan_roles,
          { ...newRole },
        ],
      }));
      setNewRole({ title: '', role_id: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = createSubscriptionPlanSchema.validate(formData, {
      abortEarly: false,
    });
    if (error) {
      alert(
        'Validation failed:\n' + error.details.map((d) => d.message).join('\n')
      );
      return;
    }

    try {
      const res = await fetch('/api/subscription-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create subscription plan.');
      alert('Subscription Plan created successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-8 mb-3 overflow-h-auto'>
      {/* Basic Info */}
      <section className='space-y-4'>
        <h2 className='text-xl font-medium text-gray-700 dark:text-gray-200'>
          Plan Information
        </h2>
        <Input
          name='name'
          placeholder='Plan Name'
          value={formData.name}
          onChange={handleInputChange}
          required
        />

        <Textarea
          name='description'
          placeholder='Plan Description'
          value={formData.description!}
          onChange={handleInputChange}
          required
        />
        <input
          type='file'
          name='cover_image'
          placeholder='Cover Image URL'
          value={formData.cover_image!}
          onChange={handleInputChange}
        />
      </section>

      {/* Pricing Section */}
      <section className='space-y-4'>
        <h2 className='text-xl font-medium text-gray-700 dark:text-gray-200'>
          Pricing Options
        </h2>

        {formData.subscription_plan_prices.length > 0 && (
          <ul className='flex flex-wrap gap-2'>
            {formData.subscription_plan_prices.map((p, idx) => (
              <li
                key={idx}
                className='bg-green-100 dark:bg-green-800 text-sm text-green-800 dark:text-green-200 px-3 py-1 rounded-full'
              >
                ₦{p.price} / {p.period}
              </li>
            ))}
          </ul>
        )}

        <div className='flex flex-col sm:flex-row gap-2'>
          <input
            type='number'
            placeholder='Amount (₦)'
            value={newPrice.price}
            onChange={(e) =>
              setNewPrice({ ...newPrice, price: e.target.value })
            }
            className='flex-1 border rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
          />
          <select
            value={newPrice.period}
            onChange={(e) =>
              setNewPrice({
                ...newPrice,
                period: e.target.value as SubscriptionPeriod,
              })
            }
            className='border rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
          >
            <option value='FREE'>Free</option>
            <option value='MONTHLY'>Monthly</option>
            <option value='YEARLY'>Yearly</option>
          </select>
          <button
            type='button'
            onClick={handleAddPrice}
            className='btn bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'
          >
            Add Price
          </button>
        </div>
      </section>

      {/* Roles Section */}
      <section className='space-y-4'>
        <h2 className='text-xl font-medium text-gray-700 dark:text-gray-200'>
          Included Roles
        </h2>

        {formData.subscription_plan_roles.length > 0 && (
          <ul className='flex flex-wrap gap-2'>
            {formData.subscription_plan_roles.map((role, idx) => (
              <li
                key={idx}
                className='bg-purple-100 dark:bg-purple-800 text-sm text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full'
              >
                {role.title} ({role.role_id})
              </li>
            ))}
          </ul>
        )}

        <div className='flex flex-col sm:flex-row gap-2'>
          <input
            type='text'
            placeholder='Role Title'
            value={newRole.title}
            onChange={(e) => setNewRole({ ...newRole, title: e.target.value })}
            className='flex-1 border rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
          />
          <input
            type='text'
            placeholder='Role ID'
            value={newRole.role_id}
            onChange={(e) =>
              setNewRole({ ...newRole, role_id: e.target.value })
            }
            className='flex-1 border rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
          />
          <button
            type='button'
            onClick={handleAddRole}
            className='btn bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'
          >
            Add Role
          </button>
        </div>
      </section>

      {/* Submit */}
      <div>
        <Button type='submit' variant='primary'>
          Create Plan
        </Button>
      </div>
    </form>
  );
};

export default CreateSubscriptionPlanForm;
