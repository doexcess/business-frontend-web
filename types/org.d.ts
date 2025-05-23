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
}

export interface BusinessProfileFullReponse {
  statusCode: number;
  message: string;
  data: BusinessProfileFull;
}

export interface ContactUser {
  email: string;
  id: string; // UUID format
}

export enum ContactInviteStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

export interface ContactInvite {
  id: string; // UUID format
  name: string;
  user: ContactUser;
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
