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
