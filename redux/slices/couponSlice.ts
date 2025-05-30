import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { Coupon, CouponResponse } from '@/types/coupon';
import {
  CreateCouponProps,
  UpdateCouponProps,
} from '@/lib/schema/coupon.schema';

interface CouponState {
  coupons: Coupon[];
  coupon: Coupon | null;
  count: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
}

// Initial state
const initialState: CouponState = {
  coupons: [],
  coupon: null,
  count: 0,
  loading: false,
  error: null,
  currentPage: 1,
};

// Async thunk to fetch paginated coupons
export const fetchCoupons = createAsyncThunk(
  'coupon-management/fetch/:business',
  async ({
    page,
    limit,
    q,
    startDate,
    endDate,
    business_id,
  }: {
    page?: number;
    limit?: number;
    q?: string;
    startDate?: string;
    endDate?: string;
    business_id?: string;
  }) => {
    const params: Record<string, any> = {};

    if (page !== undefined) params['pagination[page]'] = page;
    if (limit !== undefined) params['pagination[limit]'] = limit;
    if (q !== undefined) params['q'] = q;
    if (startDate !== undefined) params['startDate'] = startDate;
    if (endDate !== undefined) params['endDate'] = endDate;
    // if (business_id !== undefined) params['business_id'] = business_id;

    const { data } = await api.get<CouponResponse>(
      `/coupon-management/fetch/${business_id}`,
      {
        params,
      }
    );

    return {
      coupons: data.data,
      count: data.count,
    };
  }
);

// Async thunk to create coupon
export const createCoupon = createAsyncThunk(
  'coupon-management/create',
  async (
    { credentials }: { credentials: CreateCouponProps },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post<GenericResponse>(
        '/coupon-management/create',
        credentials
      );

      return {
        message: data.message,
      };
    } catch (error: any) {
      // console.log(error);
      return rejectWithValue(error.response?.data || 'Failed to create coupon');
    }
  }
);

// Async thunk to update coupon
export const updateCoupon = createAsyncThunk(
  'coupon-management/:id',
  async (
    { id, credentials }: { id: string; credentials: UpdateCouponProps },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.patch<GenericResponse>(
        `/coupon-management/${id}`,
        credentials
      );

      return {
        message: data.message,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update ticket');
    }
  }
);

// Async thunk to delete ticket
export const deleteTicket = createAsyncThunk(
  'coupon-management/:id/delete',
  async (
    { id, business_id }: { id: string; business_id: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.delete<GenericResponse>(
        `/coupon-management/${id}`,
        {
          headers: {
            'Business-Id': business_id,
          },
        }
      );

      return {
        message: data.message,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete ticket');
    }
  }
);

const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPerPage: (state, action: PayloadAction<number>) => {
      // state.perPage = action.payload;
    },
    viewCoupon: (state, action: PayloadAction<string>) => {
      const couponId = action.payload;
      const matchedCoupon = state.coupons.find(
        (coupon) => coupon.id === couponId
      );

      if (matchedCoupon) {
        state.coupon = {
          ...matchedCoupon,
        } as Coupon;
      } else {
        state.error = 'Coupon not found in local state';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload.coupons;
        state.count = action.payload.count;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch coupons';
      });
  },
});

export const { setPage, setPerPage, viewCoupon } = couponSlice.actions;
export default couponSlice.reducer;
