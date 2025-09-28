import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
  DigitalProduct,
  DigitalProductDetailsResponse,
  DigitalProductResponse,
  ProductDetails,
  ProductsResponse,
} from '@/types/product';
import { Product } from '@/types/org';

interface ProductState {
  products: Product[];
  product: Product | null;
  digital_products: DigitalProduct[];
  count: number;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  product: null,
  digital_products: [],
  count: 0,
  loading: false,
  error: null,
};

/**
 * Fetch products by organization (general products)
 */
export const fetchProductsByOrganization = createAsyncThunk<
  ProductsResponse,
  {
    page?: number;
    limit?: number;
    q?: string;
    business_id?: string;
    type?: string;
    min_price?: number;
    max_price?: number;
  },
  { rejectValue: string }
>(
  'product/fetchProductsByOrganization',
  async (
    { page, limit, q, business_id, type, min_price, max_price },
    { rejectWithValue }
  ) => {
    const params: Record<string, any> = {};

    if (page) params['pagination[page]'] = page;
    if (limit) params['pagination[limit]'] = limit;
    if (q) params.q = q;
    if (type) params.type = type;
    if (min_price) params.min_price = min_price;
    if (max_price) params.max_price = max_price;

    try {
      const { data } = await api.get<ProductsResponse>(
        `/product-general/organization/${business_id}`,
        { params }
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products'
      );
    }
  }
);

/**
 * Fetch a single public product by ID
 */
export const fetchPublicProduct = createAsyncThunk<
  { statusCode: number; data: Product },
  string,
  { rejectValue: string }
>('product/fetchPublicProduct', async (product_id, { rejectWithValue }) => {
  try {
    const { data } = await api.get<{
      statusCode: number;
      data: Product;
    }>(`/product-general/public/${product_id}`);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch product'
    );
  }
});

/**
 * Fetch paginated digital products
 */
export const fetchDigitalProducts = createAsyncThunk<
  { digital_products: DigitalProduct[]; count: number },
  {
    page?: number;
    limit?: number;
    q?: string;
    startDate?: string;
    endDate?: string;
    business_id?: string;
  },
  { rejectValue: string }
>(
  'product/fetchDigitalProducts',
  async (
    { page, limit, q, startDate, endDate, business_id },
    { rejectWithValue }
  ) => {
    const params: Record<string, any> = {};
    if (page) params['pagination[page]'] = page;
    if (limit) params['pagination[limit]'] = limit;
    if (q) params.q = q;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const headers: Record<string, string> = {};
    if (business_id) headers['Business-Id'] = business_id;

    try {
      const { data } = await api.get<DigitalProductResponse>(
        '/product-digital-crud',
        { params, headers }
      );
      return { digital_products: data.data, count: data.count };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch digital products'
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
        state.error = action.payload || 'Error fetching products';
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
          action: PayloadAction<{ statusCode: number; data: Product }>
        ) => {
          state.loading = false;
          state.product = action.payload.data;
        }
      )
      .addCase(fetchPublicProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching product';
      })

      // fetchDigitalProducts
      .addCase(fetchDigitalProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDigitalProducts.fulfilled,
        (
          state,
          action: PayloadAction<{
            digital_products: DigitalProduct[];
            count: number;
          }>
        ) => {
          state.loading = false;
          state.digital_products = action.payload.digital_products;
          state.count = action.payload.count;
        }
      )
      .addCase(fetchDigitalProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching digital products';
      });
  },
});

export default productSlice.reducer;
