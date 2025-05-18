import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
  CategoryResponse,
  CategoryWithCreator,
  CreateCourseResponse,
  ProductDetails,
} from '@/types/product';
import { CreateCourseProps } from '@/lib/schema/product.schema';

interface ProductState {
  products: ProductDetails[];
  categories: CategoryWithCreator[];
  count: number;
  categoriesCount: number;
  loading: boolean;
  categoriesLoading: boolean;
  error: string | null;
  currentPage: number;
}

// Initial state
const initialState: ProductState = {
  products: [],
  categories: [],
  categoriesCount: 0,
  count: 0,
  loading: false,
  categoriesLoading: false,
  error: null,
  currentPage: 1,
};

// Async thunk to fetch paginated categories
export const fetchCategories = createAsyncThunk(
  'product-category',
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

    const { data } = await api.get<CategoryResponse>('/product-category', {
      params,
    });

    return {
      categories: data.data,
      count: data.count,
    };
  }
);

export const createCourse = createAsyncThunk(
  'product-course-crud/create',
  async (
    {
      credentials,
      business_id,
    }: { credentials: CreateCourseProps; business_id: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post<CreateCourseResponse>(
        '/product-course-crud/create',
        credentials,
        {
          headers: {
            'Business-Id': business_id,
          },
        }
      );

      return {
        message: data.message,
        data: data.data,
      };
    } catch (error: any) {
      // console.log(error);
      return rejectWithValue(error.response?.data || 'Failed to create course');
    }
  }
);

const productSlice = createSlice({
  name: 'product',
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
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload.categories;
        state.categoriesCount = action.payload.count;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create course';
      });
  },
});

export const { setPage, setPerPage } = productSlice.actions;
export default productSlice.reducer;
