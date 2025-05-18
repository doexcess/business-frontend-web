import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
  CreateBusinessProfileProps,
  SaveBankAccountProps,
} from '@/lib/schema/product.schema';
import {
  BusinessProfile,
  BusinessProfileFull,
  BusinessProfileFullReponse,
  BusinessProfileResponse,
} from '@/types/org';

interface OrgState {
  orgs: BusinessProfile[];
  org: BusinessProfileFull | null;
  count: number;
  orgsCount: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
}

const initialState: OrgState = {
  orgs: [],
  org: null,
  orgsCount: 0,
  count: 0,
  loading: false,
  error: null,
  currentPage: 1,
};

// Async thunk to fetch paginated organizations
export const fetchOrgs = createAsyncThunk(
  'onboard/fetch-businesses',
  async ({
    page,
    limit,
    q,
    startDate,
    endDate,
  }: {
    page?: number;
    limit?: number;
    q?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const params: Record<string, any> = {};

    if (page !== undefined) params['pagination[page]'] = page;
    if (limit !== undefined) params['pagination[limit]'] = limit;
    if (q !== undefined) params['q'] = q;
    if (startDate !== undefined) params['startDate'] = startDate;
    if (endDate !== undefined) params['endDate'] = endDate;

    const { data } = await api.get<BusinessProfileResponse>(
      '/onboard/fetch-businesses',
      {
        params,
      }
    );

    return {
      organizations: data.data,
    };
  }
);

// Async thunk to fetch organization details
export const fetchOrg = createAsyncThunk(
  'onboard/fetch-business-info/:id',
  async (id: string) => {
    const { data } = await api.get<BusinessProfileFullReponse>(
      `/onboard/fetch-business-info/${id}`
    );

    return {
      organization: data.data,
    };
  }
);

// Async thunk to save organization info
export const saveOrgInfo = createAsyncThunk(
  'onboard/save-business-info',
  async (credentials: CreateBusinessProfileProps, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        'onboard/save-business-info',
        credentials
      );

      return {
        message: data.message,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to save org info');
    }
  }
);

// Async thunk to save withdrawal account
export const saveWithdrawalAccount = createAsyncThunk(
  'onboard/save-withdrawal-account',
  async (credentials: SaveBankAccountProps, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        'onboard/save-withdrawal-account',
        credentials
      );

      return {
        message: data.message,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to save withdrawal account info'
      );
    }
  }
);

const orgSlice = createSlice({
  name: 'org',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPerPage: (state, action: PayloadAction<number>) => {
      // Optional per page setter
    },
    switchToOrg: (state, action: PayloadAction<string>) => {
      const orgId = action.payload;
      const matchedOrg = state.orgs.find((org) => org.id === orgId);

      if (matchedOrg) {
        state.org = {
          ...matchedOrg,
          // Placeholder defaults for BusinessProfileFull fields if needed
          // address: '',
          // contactEmail: '',
          // bankDetails: null,
          // ...extend with other full fields as needed
        } as BusinessProfileFull;
      } else {
        state.error = 'Organization not found in local state';
      }
    },
    clearOrg: (state) => {
      state.org = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrgs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrgs.fulfilled, (state, action) => {
        state.loading = false;
        state.orgs = action.payload.organizations;
      })
      .addCase(fetchOrgs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch organizations';
      })
      .addCase(fetchOrg.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrg.fulfilled, (state, action) => {
        state.loading = false;
        state.org = action.payload.organization;
      })
      .addCase(fetchOrg.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch organization details';
      })
      .addCase(saveOrgInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveOrgInfo.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveOrgInfo.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to save organization info';
      })
      .addCase(saveWithdrawalAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveWithdrawalAccount.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveWithdrawalAccount.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to save withdrawal account info';
      });
  },
});

export const { setPage, setPerPage, switchToOrg, clearOrg } = orgSlice.actions;

export default orgSlice.reducer;
