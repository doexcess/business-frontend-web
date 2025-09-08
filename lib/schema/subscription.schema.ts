// validators/subscriptionPlan.schema.ts
import Joi from 'joi';
import { ProductStatus, SubscriptionPeriod } from '../utils';
import { SubscriptionPlanBasic } from '@/types/subscription-plan';

// Price schema
export const subscriptionPlanPriceSchema = Joi.object({
  id: Joi.string().optional(), // Only for update
  price: Joi.number().positive().required(),
  currency: Joi.string().length(3).required(),
  period: Joi.string()
    .valid(...Object.values(SubscriptionPeriod))
    .required(),
});

// Role schema
export const subscriptionPlanRoleSchema = Joi.object({
  id: Joi.string().optional(), // Only for update
  title: Joi.string().max(255).required(),
  role_id: Joi.string().required(),
  selected: Joi.boolean().optional(),
});

// Main schema
export const createSubscriptionPlanSchema = Joi.object({
  name: Joi.string().max(255).required(),
  description: Joi.string().optional().allow('', null),
  cover_image: Joi.string().uri().max(2048).optional().allow('', null),
  business_id: Joi.string().required(),
  multimedia_id: Joi.string().required(),
  creator_id: Joi.string().required(),
  category_id: Joi.string().required(),
  subscription_plan_prices: Joi.array()
    .items(subscriptionPlanPriceSchema)
    .min(1)
    .required(),
  subscription_plan_roles: Joi.array()
    .items(subscriptionPlanRoleSchema)
    .min(1)
    .required(),
});

// Update schema (fields optional, but structure validated)
export const updateSubscriptionPlanSchema = Joi.object({
  name: Joi.string().max(255).optional(),
  category_id: Joi.string().required(),
  description: Joi.string().optional().allow('', null),
  cover_image: Joi.string().uri().max(2048).optional().allow('', null),
  multimedia_id: Joi.string().required(),
  status: Joi.string()
    .valid(...Object.values(ProductStatus))
    .required(),
  subscription_plan_prices: Joi.array()
    .items(subscriptionPlanPriceSchema)
    .optional(),
  subscription_plan_roles: Joi.array()
    .items(subscriptionPlanRoleSchema)
    .optional(),
});

export interface SubscriptionPlanPriceProps {
  id?: string; // optional for updates
  price: string | number;
  currency: string; // e.g., 'NGN'
  period: SubscriptionPeriod;
  subscription_plan?: {
    subscriptions: SubscriptionPlanBasic[];
  };
}

export interface SubscriptionPlanRoleProps {
  id?: string; // optional for updates
  title: string;
  role_id: string;
  selected?: boolean;
}

export interface CreateSubscriptionPlanProps {
  name: string;
  description?: string | null;
  cover_image?: string | null;
  category_id?: string | null;
  business_id: string;
  creator_id: string;
  status?: ProductStatus;
  subscriptions?: SubscriptionPlanBasic[];
  subscription_plan_prices: SubscriptionPlanPriceProps[];
  subscription_plan_roles: SubscriptionPlanRoleProps[];
}

export interface UpdateSubscriptionPlanProps {
  name?: string;
  description?: string | null;
  cover_image?: string | null;
  category_id?: string;
  multimedia_id?: string;
  status?: ProductStatus;
  subscription_plan_prices?: SubscriptionPlanPriceProps[];
  subscription_plan_roles?: SubscriptionPlanRoleProps[];
}
