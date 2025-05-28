import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
  Payment,
  PaymentDetailsResponse,
  PaymentsResponse,
} from '@/types/payment';

interface PaymentState {
  payments: Payment[];
  payment: Payment | null;
  total_credit: number;
  total_debit: number;
  total_trx: number;
  count: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
}

// Initial state
const initialState: PaymentState = {
  payments: [],
  payment: null,
  total_credit: 0,
  total_debit: 0,
  total_trx: 0,
  count: 0,
  loading: false,
  error: null,
  currentPage: 1,
};

// Async thunk to fetch paginated payments
export const fetchPayments = createAsyncThunk(
  'payment/fetch',
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
    if (q !== undefined) params.q = q;
    if (startDate !== undefined) params.startDate = startDate;
    if (endDate !== undefined) params.endDate = endDate;

    const headers: Record<string, string> = {};
    if (business_id) headers['Business-Id'] = business_id;

    const { data } = await api.get<PaymentsResponse>('/payment/fetch', {
      params,
      headers,
    });

    return {
      payments: data.data,
      count: data.count,
      total_credit: data.total_credit,
      total_debit: data.total_debit,
      total_trx: data.total_trx,
    };
  }
);

// Async thunk to fetch payment details
export const fetchPayment = createAsyncThunk(
  'payment/fetch/:id',
  async ({ id, business_id }: { id: string; business_id?: string }) => {
    const params: Record<string, any> = {};

    const headers: Record<string, string> = {};
    if (business_id) headers['Business-Id'] = business_id;

    const { data } = await api.get<PaymentDetailsResponse>(
      `/payment/fetch/${id}`,
      {
        params,
        headers,
      }
    );

    return {
      payment: data.data,
    };
  }
);

const paymentSlice = createSlice({
  name: 'payment',
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
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.payments;
        state.count = action.payload.count;
        state.total_credit = action.payload.total_credit;
        state.total_debit = action.payload.total_debit;
        state.total_trx = action.payload.total_trx;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch payments';
        state.loading = false;
      })
      .addCase(fetchPayment.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchPayment.fulfilled, (state, action) => {
        state.payment = action.payload.payment;
        state.loading = false;
      })
      .addCase(fetchPayment.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch payment details';
        state.loading = false;
      });
  },
});

export const { setPage, setPerPage } = paymentSlice.actions;
export default paymentSlice.reducer;
