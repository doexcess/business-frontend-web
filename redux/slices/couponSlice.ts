import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import Cookies from 'js-cookie';
import { PaymentsResponse, Payment } from '@/types/payment';
import { Coupon, CouponResponse } from '@/types/coupon';

interface CouponState {
  coupons: Coupon[];
  count: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
}

// Initial state
const initialState: CouponState = {
  coupons: [],
  count: 0,
  loading: false,
  error: null,
  currentPage: 1,
};

// Async thunk to fetch paginated coupons
export const fetchCoupons = createAsyncThunk(
  'coupon-management/fetch-all',
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
    if (business_id !== undefined) params['business_id'] = business_id;

    const { data } = await api.get<CouponResponse>(
      '/coupon-management/fetch-all',
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

export const { setPage, setPerPage } = couponSlice.actions;
export default couponSlice.reducer;
