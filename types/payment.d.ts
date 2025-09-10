import {
  PaymentMethod,
  ProductType,
  RefundStatus,
  RefundType,
  TransactionType,
} from '@/lib/utils';
import { Profile } from './account';
import { UserProfile } from './org';
import { Media } from './multimedia';

export interface PaymentItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  created_at: string;
  product_id: string;
  purchase_type: string;
}

export interface Purchase {
  items: PaymentItem[];
  coupon_id: string | null;
  business_id: string;
  coupon_type: string | null;
  coupon_value: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  phone: string | null;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  role_identity: string;
  is_suspended: boolean;
  suspended_by: string | null;
  suspended_at: string | null;
  suspension_reason: string | null;
  profile: UserProfile;
}

export interface Payment {
  id: string;
  user_id: string;
  purchase_type: string;
  purchase_id: string | null;
  amount: string;
  discount_applied: string;
  payment_status: string;
  transaction_id: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  billing_at_payment: string | null;
  billing_id: string | null;
  interval: string | null;
  currency: string;
  auto_renew: boolean;
  is_renewal: boolean;
  is_upgrade: boolean;
  metadata: any;
  purchase: Purchase;
  transaction_type: TransactionType | null;
  user: User;
  subscription_plan: SubscriptionPlan; // Replace with actual type if available
  billing_info: BillingInformation; // Replace with actual type if available
  refunds: Refund[]; // Replace with actual type if available
  business_info: BusinessInfo;
  payment_gateway_logs: PaymentGatewayLog[]; // Replace with actual type if available
  full_purchases_details: {
    items: FullPurchaseDetails[];
    coupon_id: string | null;
    business_id: string | null;
    coupon_type: string | null;
    coupon_value: string | null;
  };
}

interface BusinessInfo {
  id: string;
  business_name: string;
  business_description: string;
  business_size: string;
}

interface FullPurchaseDetails {
  id: string;
  name: string;
  price: number;
  quantity: number;
  created_at: string;
  product_id: string;
  purchase_type: ProductType;
  details: PurchasedDigitalProduct;
}

export interface PurchasedDigitalProduct {
  id: string;
  user_id: string;
  product_id: string;
  payment_id: string | null;
  quantity: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  product: {
    multimedia: Media;
    zip_file: Media;
    business_info: {
      id: true;
      business_name: true;
      business_size: true;
      business_description: true;
    };
    title: true;
    description: true;
  };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  cover_image: string | null;
  business_id: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  deleted_at: string | null;
  creator_id: string;
}

export interface PaymentGatewayLog {
  id: string;
  payment_id: string;
  event_type: string;
  payload: any; // Use a more specific type if you know the structure
  metadata?: any; // Optional, can also be more specific
  error?: string;
  created_at: string; // ISO string if coming from the database
  updated_at: string;
  deleted_at?: string | null;
}

export interface Refund {
  id: string;
  payment_id: string;
  amount: string; // Prisma Decimal is often serialized as a string
  reason?: string | null;
  status: RefundStatus;
  type: RefundType;
  refund_method: PaymentMethod;
  created_at: string; // ISO 8601 format date string
  updated_at: string;
  deleted_at?: string | null;
}

export interface BillingInformation {
  id: string;
  user_id: string;
  address: string;
  state: string;
  apartment?: string | null;
  postal_code: string;
  city: string;
  country: string; // defaults to "Nigeria"
  country_code: string; // defaults to "NG"
  created_at: string; // ISO 8601 date string
  updated_at: string;
  deleted_at?: string | null;
  selected?: boolean | null;
}

export interface PaymentsResponse {
  statusCode: number;
  data: Payment[];
  count: number;
  total_credit: number;
  total_debit: number;
  total_trx: number;
}

export interface PaymentDetailsResponse {
  statusCode: number;
  data: Payment;
}

// Payment initialization response types

export interface PaymentInitData {
  authorization_url: string;
  payment_id: string;
  access_code: string;
}

export interface PaymentInitResponse {
  statusCode: number;
  message: string;
  data: PaymentInitData;
}

export interface VerifyPaymentResponse {
  statusCode: number;
  message: string;
}
