import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
  BusinessProfile,
  BusinessProfileFull,
  BusinessProfileFullReponse,
  BusinessProfileResponse,
  ContactInvite,
  ContactInviteDetailsResponse,
  ContactInviteResponse,
} from '@/types/org';
import {
  AcceptInviteProps,
  CreateBusinessProfileProps,
  InviteContactProps,
  SaveBankAccountProps,
} from '@/lib/schema/org.schema';
import { ContactInviteStatus } from '@/lib/utils';

interface OrgState {
  orgs: BusinessProfile[];
  org: BusinessProfileFull | null;
  invites: ContactInvite[];
  invite: ContactInvite | null;
  invitesCount: number;
  invitesLoading: boolean;
  invitesError: string | null;
  count: number;
  orgsCount: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
}

const initialState: OrgState = {
  orgs: [],
  org: null,
  invites: [],
  invite: null,
  invitesCount: 0,
  invitesLoading: true,
  invitesError: null,
  orgsCount: 0,
  count: 0,
  loading: true,
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
        '/onboard/save-business-info',
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
        '/onboard/save-withdrawal-account',
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

// Async thunk to invite team member
export const inviteMember = createAsyncThunk(
  'contact/invite',
  async (credentials: InviteContactProps, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/contact/invite', credentials);

      return {
        message: data.message,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to invite team member'
      );
    }
  }
);

// Async thunk to reinvite team member
export const reinviteMember = createAsyncThunk(
  'contact/reinvite-member/:invite_id',
  async ({ invite_id }: { invite_id: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/contact/reinvite-member/${invite_id}`);

      return {
        message: data.message,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to reinvite team member'
      );
    }
  }
);

// Async thunk to accept invite
export const acceptInvite = createAsyncThunk(
  'contact/accept-invite',
  async (credentials: AcceptInviteProps, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/contact/accept-invite', credentials);

      return {
        message: data.message,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to accept invite');
    }
  }
);

// Async thunk to fetch invites
export const fetchInvites = createAsyncThunk(
  'contact/invites/:business_id',
  async (
    {
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
    },
    { rejectWithValue }
  ) => {
    try {
      const params: Record<string, any> = {};

      if (page !== undefined) params['pagination[page]'] = page;
      if (limit !== undefined) params['pagination[limit]'] = limit;
      if (q !== undefined) params.q = q;
      if (startDate !== undefined) params.startDate = startDate;
      if (endDate !== undefined) params.endDate = endDate;

      const headers: Record<string, string> = {};
      if (business_id) headers['Business-Id'] = business_id;

      const { data } = await api.get<ContactInviteResponse>(
        `/contact/invites/${business_id}`,
        {
          params,
          headers,
        }
      );

      return {
        invites: data.data,
        count: data.count,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch invites');
    }
  }
);

// Async thunk to view invite by token
export const viewInviteByToken = createAsyncThunk(
  'contact/invite/:token',
  async ({ token }: { token: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ContactInviteDetailsResponse>(
        `/contact/invite/${token}`
      );

      return {
        data: data.data,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to view invite');
    }
  }
);

// Async thunk to remove member
export const removeMember = createAsyncThunk(
  'contact/remove-member/:invite_id',
  async ({ invite_id }: { invite_id: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/contact/remove-member/${invite_id}`);

      return {
        message: data.message,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to remove member');
    }
  }
);

// Async thunk to deactivate member
export const deactivateMember = createAsyncThunk(
  'contact/deactivate-member/:invite_id',
  async ({ invite_id }: { invite_id: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        `/contact/deactivate-member/${invite_id}`
      );

      return {
        message: data.message,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to deactivate member'
      );
    }
  }
);

// Async thunk to restore member
export const restoreMember = createAsyncThunk(
  'contact/restore-member/:invite_id',
  async ({ invite_id }: { invite_id: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/contact/restore-member/${invite_id}`);

      return {
        message: data.message,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to restore member'
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
        } as BusinessProfileFull;
      } else {
        state.error = 'Organization not found in local state';
      }
    },
    clearOrg: (state) => {
      state.org = null;
    },
    viewInvite: (state, action: PayloadAction<string>) => {
      const inviteId = action.payload;
      const matchedInvite = state.invites.find(
        (invite) => invite.id === inviteId
      );

      if (matchedInvite) {
        state.invite = {
          ...matchedInvite,
        } as ContactInvite;
      } else {
        state.error = 'Invite not found in local state';
      }
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
      })
      // Team management
      .addCase(inviteMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(inviteMember.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(inviteMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to invite team member';
      })
      .addCase(reinviteMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reinviteMember.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(reinviteMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to reinvite team member';
      })
      .addCase(acceptInvite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptInvite.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(acceptInvite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to accept invite';
      })
      .addCase(fetchInvites.pending, (state) => {
        state.invitesLoading = true;
        state.invitesError = null;
      })
      .addCase(fetchInvites.fulfilled, (state, action) => {
        state.invitesLoading = false;
        state.invites = action.payload.invites;
        state.invitesCount = action.payload.count;
      })
      .addCase(fetchInvites.rejected, (state, action) => {
        state.invitesLoading = false;
        state.invitesError = action.error.message || 'Failed to fetch invites';
      })
      .addCase(viewInviteByToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(viewInviteByToken.fulfilled, (state, action) => {
        state.loading = false;
        state.invite = action.payload.data;
      })
      .addCase(viewInviteByToken.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Failed to fetch invite';
      })
      .addCase(removeMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(removeMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove member';
      })
      .addCase(deactivateMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deactivateMember.fulfilled, (state, action) => {
        state.loading = false;
        state.invite = {
          ...state.invite!,
          status: ContactInviteStatus.INACTIVE,
        };
      })
      .addCase(deactivateMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to deactivate member';
      })
      .addCase(restoreMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreMember.fulfilled, (state, action) => {
        state.loading = false;
        state.invite = {
          ...state.invite!,
          status: ContactInviteStatus.ACTIVE,
        };
      })
      .addCase(restoreMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to restore member';
      });
  },
});

export const { setPage, setPerPage, switchToOrg, clearOrg, viewInvite } =
  orgSlice.actions;

export default orgSlice.reducer;
