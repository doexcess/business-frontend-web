import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
  SubscriptionPlan,
  SubscriptionPlanResponse,
} from '@/types/subscription-plan';
import {
  CreateSubscriptionPlanProps,
  UpdateSubscriptionPlanProps,
} from '@/lib/schema/subscription.schema';

interface SubscriptionPlanState {
  subscription_plans: SubscriptionPlan[];
  count: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
}

// Initial state
const initialState: SubscriptionPlanState = {
  subscription_plans: [],
  count: 0,
  loading: false,
  error: null,
  currentPage: 1,
};

// Async thunk to fetch paginated subscription plans
export const fetchSubscriptionPlans = createAsyncThunk(
  'subscription-plan/fetch/:business_id',
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

    const { data } = await api.get<SubscriptionPlanResponse>(
      `/subscription-plan/fetch/${business_id}`,
      {
        params,
      }
    );

    return {
      subscription_plans: data.data,
      count: data.count,
    };
  }
);

// Async thunk to create subscription plan
export const createSubscriptionPlan = createAsyncThunk(
  'subscription-plan/bulk-create',
  async (
    { credentials }: { credentials: CreateSubscriptionPlanProps },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post<GenericResponse>(
        '/subscription-plan/bulk-create',
        credentials
      );

      return {
        message: data.message,
      };
    } catch (error: any) {
      // console.log(error);
      return rejectWithValue(
        error.response?.data || 'Failed to create subscription plan'
      );
    }
  }
);

// Async thunk to update subscription plan
export const updateSubscriptionPlan = createAsyncThunk(
  'subscription-plan/:id/bulk-update',
  async (
    {
      id,
      credentials,
    }: { id?: string; credentials: UpdateSubscriptionPlanProps },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.patch<GenericResponse>(
        `/subscription-plan/${id}/bulk-update`,
        credentials
      );

      return {
        message: data.message,
      };
    } catch (error: any) {
      // console.log(error);
      return rejectWithValue(
        error.response?.data || 'Failed to update subscription plan'
      );
    }
  }
);

const subscriptionPlanSlice = createSlice({
  name: 'subscriptonPlan',
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
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription_plans = action.payload.subscription_plans;
        state.count = action.payload.count;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch subscription plans';
      })
      .addCase(createSubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubscriptionPlan.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to create subscription plan';
      })
      .addCase(updateSubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubscriptionPlan.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to update subscription plan';
      });
  },
});

export const { setPage, setPerPage } = subscriptionPlanSlice.actions;
export default subscriptionPlanSlice.reducer;
