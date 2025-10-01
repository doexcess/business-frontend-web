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
  ExportUserResponse,
  KYC,
  UpdateOnboardingProcessResponse,
} from '@/types/org';
import {
  AcceptInviteProps,
  CreateBusinessProfileProps,
  DocFormat,
  ImportUsersProps,
  InviteContactProps,
  ResolveAccountProps,
  SaveBankAccountProps,
  UpdateOnboardingProcessProps,
} from '@/lib/schema/org.schema';
import {
  BusinessOwnerOrgRole,
  ContactInviteStatus,
  onboardingProcesses,
  SystemRole,
} from '@/lib/utils';
import {
  BanksResponse,
  KYCResponse,
  PaystackBank,
  ResolveAccountResponse,
  TransferRecipientData,
} from '@/types/account';
import {
  CustomerDetailsResponse,
  CustomersResponse,
} from '@/types/notification';
import {
  BusinessCurrencies,
  BusinessCurrenciesResponse,
  CurrencyActionResponse,
} from '@/types/currency';

interface CurrencyState {
  currencies: BusinessCurrencies | null;
  loading: boolean;
  error: string | null;
}

const initialState: CurrencyState = {
  currencies: null,
  loading: true,
  error: null,
};

// Async thunk to fetch business currencies
export const fetchBusinessCurrencies = createAsyncThunk(
  'currency/business-currencies',
  async ({ business_id }: { business_id: string }) => {
    const { data } = await api.get<BusinessCurrenciesResponse>(
      '/currency/business-currencies',
      {
        headers: {
          'Business-Id': business_id,
        },
      }
    );

    return data.data;
  }
);

// Async thunk to toggle business currency
export const toggleBusinessCurrency = createAsyncThunk(
  'currency/toggle-business-currency',
  async (
    { currency, business_id }: { currency: string; business_id: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.patch<CurrencyActionResponse>(
        `/currency/toggle-business-currency`,
        { currency },
        {
          headers: {
            'Business-Id': business_id,
          },
        }
      );

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to toggle business currency'
      );
    }
  }
);

// Async thunk to toggle product currency
export const toggleProductCurrency = createAsyncThunk(
  'currency/toggle-product-currency',
  async (
    { currency, business_id }: { currency: string; business_id: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.patch<CurrencyActionResponse>(
        `/currency/toggle-product-currency`,
        { currency },
        {
          headers: {
            'Business-Id': business_id,
          },
        }
      );

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to toggle product currency'
      );
    }
  }
);

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinessCurrencies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessCurrencies.fulfilled, (state, action) => {
        state.loading = false;
        state.currencies = action.payload;
      })
      .addCase(fetchBusinessCurrencies.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch business currencies';
      })
      .addCase(toggleBusinessCurrency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleBusinessCurrency.fulfilled, (state, action) => {
        state.loading = false;

        if (!state.currencies?.account) return;

        const details = action.payload.data;

        switch (details.action) {
          case 'removed':
            state.currencies.account = state.currencies.account.filter(
              (accountCurrency) => accountCurrency.currency !== details.currency
            );
            break;

          case 'added':
            if (details.data) {
              state.currencies.account = [
                ...state.currencies.account,
                details.data,
              ];
            }
            break;

          default:
            break;
        }
      })
      .addCase(toggleBusinessCurrency.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to toggle business currency';
      })
      .addCase(toggleProductCurrency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleProductCurrency.fulfilled, (state, action) => {
        state.loading = false;

        if (!state.currencies?.product) return;

        const details = action.payload.data;

        switch (details.action) {
          case 'removed':
            state.currencies.product = state.currencies.product.filter(
              (productCurrency) => productCurrency.currency !== details.currency
            );
            break;

          case 'added':
            if (details.data) {
              state.currencies.product = [
                ...state.currencies.product,
                details.data,
              ];
            }
            break;

          default:
            break;
        }
      })
      .addCase(toggleProductCurrency.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to toggle product currency';
      });
  },
});

export const {} = currencySlice.actions;

export default currencySlice.reducer;
