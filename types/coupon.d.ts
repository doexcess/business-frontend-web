import { CouponType } from '@/lib/utils';

export interface Role {
  name: string;
  role_id: string;
}

export interface Creator {
  id: string;
  name: string;
  role: Role;
}

export interface Business {
  id: string;
  business_name: string;
  user_id: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType; // Extend as needed
  value: number;
  currency: string;
  start_date: string; // Consider Date if parsing
  end_date: string; // Consider Date if parsing
  usage_limit: number;
  user_limit: number;
  min_purchase: number;
  is_active: boolean;
  created_at: string; // Consider Date if parsing
  creator: Creator;
  business: Business;
}

export interface CouponResponse {
  statusCode: number;
  data: Coupon[];
  count: number;
}
