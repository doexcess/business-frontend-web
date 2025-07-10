import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
  Payment,
  PaymentDetailsResponse,
  PaymentInitResponse,
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
  createResponse: any;
  verifyResponse: any;
}

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
  createResponse: null,
  verifyResponse: null,
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

// Async thunk to create a payment
export const createPayment = createAsyncThunk(
  'payment/create',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post<PaymentInitResponse>(
        '/payment/create',
        payload
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create payment'
      );
    }
  }
);

// Async thunk to verify a payment
export const verifyPayment = createAsyncThunk(
  'payment/verify',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/payment/verify/${id}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to verify payment'
      );
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
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
      })
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.createResponse = action.payload;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.verifyResponse = action.payload;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default paymentSlice.reducer;
