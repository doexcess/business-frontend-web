import api from '@/lib/api';
import {
  UpdatePasswordProps,
  UserProfileProps,
  UserProfileSchemaProps,
} from '@/lib/schema/auth.schema';
import { Profile, ProfileResponse } from '@/types/account';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;
  profile: Profile | null;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  token: Cookies.get('token') || null,
  loading: false,
  error: null,
};

// Async Thunk for login
export const login = createAsyncThunk(
  'auth/request-otp',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/auth/request-otp', credentials);
      const { user, token } = response.data;
      return { user, token };
    } catch (error: any) {
      // console.log(error);
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

// Async Thunk for verify login
export const verifyLogin = createAsyncThunk(
  'auth/verify-otp',
  async (credentials: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/verify-otp', credentials);
      const { accessToken: token } = response.data;
      Cookies.set('token', token, { expires: 3 });
      return { token };
    } catch (error: any) {
      // console.log(error);
      return rejectWithValue(error.response?.data || 'OTP verification failed');
    }
  }
);

// Async Thunk to save profile information
export const saveProfile = createAsyncThunk(
  'auth/save-profile-info',
  async (credentials: UserProfileProps, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/save-profile-info', credentials);

      return {
        message: data.message,
      };
    } catch (error: any) {
      // console.log(error);
      return rejectWithValue(
        error.response?.data || 'Failed to save profile info'
      );
    }
  }
);

// Async Thunk to view profile information
export const viewProfile = createAsyncThunk('auth/view-profile', async () => {
  try {
    const { data } = await api.get<ProfileResponse>('/auth/view-profile');

    return {
      profile: data.data,
    };
  } catch (error: any) {
    console.log(error);
  }
});

// Async Thunk to update password information
export const updatePassword = createAsyncThunk(
  'auth/update-password',
  async (credentials: UpdatePasswordProps, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/update-password', credentials);

      return {
        message: data.message,
      };
    } catch (error: any) {
      // console.log(error);
      return rejectWithValue(
        error.response?.data || 'Failed to update password'
      );
    }
  }
);

// Async Thunk for logout
export const logout = createAsyncThunk('auth/logout', async () => {
  Cookies.remove('token');
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(verifyLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(saveProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(viewProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(viewProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload?.profile!;
      })
      .addCase(viewProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
