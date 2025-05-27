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
  transaction_type: string | null;
  user: User;
  subscription_plan: any; // Replace with actual type if available
  billing_info: any; // Replace with actual type if available
  refunds: any[]; // Replace with actual type if available
  payment_gateway_logs: any[]; // Replace with actual type if available
}
