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

export interface ProfileResponse {
  statusCode: number;
  data: Profile;
}
