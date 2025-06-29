import { DocFormat } from '@/lib/schema/org.schema';
import { BusinessOwnerOrgRole, ContactInviteStatus, Gender } from '@/lib/utils';

export interface BusinessProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_size: 'small' | 'medium' | 'large' | string;
  timeline: string;
  logo_url: string;
  industry: string;
  working_hours: string | null;
  location: string;
  state: string | null;
  country: string;
  country_code: string;
  created_at: string; // ISO timestamp string
  updated_at: string; // ISO timestamp string
}

export interface BusinessProfileResponse {
  statusCode: number;
  data: BusinessProfile[];
}

export interface BusinessProfileFull {
  id: string;
  user_id: string;
  business_name: string;
  business_size: 'small' | 'medium' | 'large' | string;
  timeline: string;
  logo_url: string;
  industry: string;
  working_hours: string | null;
  location: string;
  state: string | null;
  country: string;
  country_code: string;
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
  onboarding_status: {
    current_step: number;
    is_completed: boolean;
  };
  business_wallet: {
    balance: string;
    previous_balance: string;
    currency: string;
  };
  withdrawal_account: WithdrawalAccount;
}

export interface WithdrawalAccount {
  id: string;
  business_id: string;
  account_number: string;
  account_type: string; // e.g., "Savings Bank"
  bank_name: string;
  routing_number: string | null;
  recipient_code: string;
  country: string; // e.g., "Nigeria"
  country_code: string; // e.g., "NG"
  currency: string; // e.g., "NGN"
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
  deleted_at: string | null;
}

export interface BusinessProfileFullReponse {
  statusCode: number;
  message: string;
  data: BusinessProfileFull;
}

export interface UserProfile {
  id: string; // UUID format
  user_id: string; // UUID format
  profile_picture: string; // URL
  address: string;
  bio: string;
  date_of_birth: string; // ISO 8601 date string
  gender: Gender;
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
  deleted_at: string | null; // ISO 8601 datetime or null
  country: string;
  state: string | null;
  country_code: string; // ISO 2-letter country code
}

export interface ContactUser {
  id: string; // UUID format
  role: {
    name: string;
    role_id: string;
  };
  profile: UserProfile | null;
}

export interface ContactInvite {
  id: string; // UUID format
  name: string;
  email: string;
  is_owner: boolean;
  user: ContactUser | null;
  business: BusinessProfile;
  token: string | null;
  status: ContactInviteStatus; // Assuming possible status values
  expires_at: string | null; // ISO date string or null
  created_at: string; // ISO date string
}

export interface ContactInviteResponse {
  statusCode: number;
  data: ContactInvite[];
  count: number;
}

export interface ContactInviteDetailsResponse {
  statusCode: number;
  data: ContactInvite;
}

export interface ExportUserDetails {
  download_url: string;
  total: number;
  format: DocFormat;
  role_filter: BusinessOwnerOrgRole;
  file_name: string;
}

export interface ExportUserResponse {
  statusCode: number;
  message: string;
  data: ExportUserDetails;
}
