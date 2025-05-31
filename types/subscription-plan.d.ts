export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  cover_image: string | null;
  business_id: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  business: Business;
  subscription_plan_prices: SubscriptionPricing[];
  subscription_plan_roles: SubscriptionRole[];
  creator: User;
}

export interface Business {
  id: string;
  user_id: string;
  business_name: string;
  business_size: string;
  timeline: string;
  logo_url: string;
  industry: string;
  working_hours: string | null;
  location: string;
  state: string | null;
  country: string;
  country_code: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SubscriptionPricing {
  id: string;
  subscription_plan_id: string;
  price: string;
  currency: string;
  creator_id: string;
  period: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SubscriptionRole {
  id: string;
  subscription_plan_id: string;
  creator_id: string;
  title: string;
  role_id: string;
  selected: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  created_at: string;
  role: Role;
}

export interface Role {
  id: string;
  name: string;
  role_id: string;
  role_group_id: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SubscriptionPlanResponse {
  statusCode: number;
  data: SubscriptionPlan[];
  count: number;
}
