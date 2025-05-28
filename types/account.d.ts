import { Gender } from '@/lib/utils';

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  created_at: string; // ISO string or datetime format
  updated_at: string; // ISO string or datetime format
  role: {
    name: string;
    role_id: string;
  };
  profile: {
    bio: string;
    address: string;
    profile_picture: string;
    gender: Gender;
    date_of_birth: string; // ISO 8601 format
  };
}

export interface UserProfile {
  id: string;
  user_id: string;
  profile_picture: string;
  address: string;
  bio: string;
  date_of_birth: string; // ISO 8601 date string
  gender?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  country: string;
  state?: string | null;
  country_code: string;
}

export interface ProfileResponse {
  statusCode: number;
  data: Profile;
}

// Banks
export interface PaystackBank {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string | null;
  pay_with_bank: boolean;
  supports_transfer: boolean;
  active: boolean;
  country: string;
  currency: string;
  type: string;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaystackBanksResponse {
  status: boolean;
  message: string;
  data: PaystackBank[];
}

export interface BanksResponse {
  statusCode: number;
  data: PaystackBanksResponse;
}

// Resolve bank account
export interface RecipientDetails {
  authorization_code: string | null;
  account_number: string;
  account_name: string;
  bank_code: string;
  bank_name: string;
}

export interface TransferRecipientData {
  active: boolean;
  createdAt: string;
  currency: string;
  description: string | null;
  domain: string;
  email: string | null;
  id: number;
  integration: number;
  metadata: any | null;
  name: string;
  recipient_code: string;
  type: string;
  updatedAt: string;
  is_deleted: boolean;
  isDeleted: boolean;
  details: RecipientDetails;
}

export interface CreateTransferRecipientResponse {
  status: boolean;
  message: string;
  data: TransferRecipientData;
}

export interface ResolveAccountResponse {
  statusCode: number;
  data: CreateTransferRecipientResponse;
}
