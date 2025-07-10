import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

interface PaymentState {
  loading: boolean;
  error: string | null;
  createResponse: any;
  verifyResponse: any;
}

const initialState: PaymentState = {
  loading: false,
  error: null,
  createResponse: null,
  verifyResponse: null,
};

// Async thunk to create a payment
export const createPayment = createAsyncThunk(
  'payment/create',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/payment/create', payload);
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
      const response = await api.get(`/payment/verify/${id}`);
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
