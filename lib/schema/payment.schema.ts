// Payment schema for creating a payment

import { ProductType } from '../utils';

export interface PaymentPurchase {
  purchase_id: string;
  quantity: number;
  purchase_type: ProductType;
}

export interface CreatePaymentPayload {
  email: string;
  purchases: PaymentPurchase[];
  amount: number;
  currency: string;
  business_id: string;
}

export interface CancelPaymentPayload {
  payment_id: string;
}
