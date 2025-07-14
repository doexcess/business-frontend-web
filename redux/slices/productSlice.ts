import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { ProductDetails, ProductsResponse } from '@/types/product';

interface ProductState {
  products: ProductDetails[];
  product: ProductDetails | null;
  count: number;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  product: null,
  count: 0,
  loading: false,
  error: null,
};

// Fetch products by organization (type=TICKET)
export const fetchProductsByOrganization = createAsyncThunk(
  'product/fetchProductsByOrganization',
  async (
    {
      page,
      limit,
      q,
      business_id,
      type,
      min_price,
      max_price,
    }: {
      page?: number;
      limit?: number;
      q?: string;
      business_id?: string;
      type?: string | undefined;
      min_price?: number;
      max_price?: number;
    },
    { rejectWithValue }
  ) => {
    const params: Record<string, any> = {};

    if (page !== undefined) params['pagination[page]'] = page;
    if (limit !== undefined) params['pagination[limit]'] = limit;
    if (q !== undefined) params.q = q;
    if (type !== undefined) params.type = type;
    if (min_price !== undefined) params.min_price = min_price;
    if (max_price !== undefined) params.max_price = max_price;

    try {
      const response = await api.get<ProductsResponse>(
        `/product-general/organization/${business_id}`,
        {
          params,
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products'
      );
    }
  }
);

// Fetch public product by product_id
export const fetchPublicProduct = createAsyncThunk(
  'product/fetchPublicProduct',
  async (product_id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<{
        statusCode: number;
        data: ProductDetails;
      }>(`/product-general/public/${product_id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch product'
      );
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchProductsByOrganization
      .addCase(fetchProductsByOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProductsByOrganization.fulfilled,
        (state, action: PayloadAction<ProductsResponse>) => {
          state.loading = false;
          state.products = action.payload.data;
          state.count = action.payload.count;
        }
      )
      .addCase(fetchProductsByOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchPublicProduct
      .addCase(fetchPublicProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPublicProduct.fulfilled,
        (
          state,
          action: PayloadAction<{ statusCode: number; data: ProductDetails }>
        ) => {
          state.loading = false;
          state.product = action.payload.data;
        }
      )
      .addCase(fetchPublicProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;
