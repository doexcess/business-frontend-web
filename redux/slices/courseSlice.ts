import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
  CategoryResponse,
  CategoryWithCreator,
  Course,
  CourseDetailsResponse,
  CourseResponse,
  CreateProductResponse,
  Module,
  ModuleContent,
  ModuleResponse,
  UpdateCourseResponse,
  ViewContentProps,
} from '@/types/product';
import {
  CreateCourseProps,
  CreateModulesProps,
  UpdateCourseProps,
  UpdateModulesProps,
} from '@/lib/schema/product.schema';

interface CourseState {
  courses: Course[];
  course: Course | null;
  categories: CategoryWithCreator[];
  modules: Module[];
  content: ModuleContent | null;
  count: number;
  coursesCount: number;
  categoriesCount: number;
  modulesCount: number;
  loading: boolean;
  categoriesLoading: boolean;
  coursesLoading: boolean;
  courseDetailsLoading: boolean;
  modulesLoading: boolean;
  error: string | null;
  currentPage: number;
}

// Initial state
const initialState: CourseState = {
  courses: [],
  course: null,
  categories: [],
  categoriesCount: 0,
  modules: [],
  content: null,
  count: 0,
  modulesCount: 0,
  loading: false,
  categoriesLoading: false,
  coursesCount: 0,
  coursesLoading: false,
  courseDetailsLoading: false,
  modulesLoading: false,
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

// Async thunk to create course
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
      const { data } = await api.post<CreateProductResponse>(
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

// Async thunk to fetch paginated courses
export const fetchCourses = createAsyncThunk(
  'product-course-crud',
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

    const { data } = await api.get<CourseResponse>('/product-course-crud', {
      params,
      headers,
    });

    return {
      courses: data.data,
      count: data.count,
    };
  }
);

// Async thunk to fetch course details
export const fetchCourse = createAsyncThunk(
  'product-course-crud/:id',
  async ({ id, business_id }: { id: string; business_id?: string }) => {
    const params: Record<string, any> = {};

    const headers: Record<string, string> = {};
    if (business_id) headers['Business-Id'] = business_id;

    const { data } = await api.get<CourseDetailsResponse>(
      `/product-course-crud/${id}`,
      {
        params,
        headers,
      }
    );

    return {
      course: data.data,
    };
  }
);

// Async thunk to update course
export const updateCourse = createAsyncThunk(
  'product-course-crud/:id/update',
  async (
    {
      id,
      credentials,
      business_id,
    }: { id: string; credentials: UpdateCourseProps; business_id: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.patch<UpdateCourseResponse>(
        `/product-course-crud/${id}`,
        credentials,
        {
          headers: {
            'Business-Id': business_id,
          },
        }
      );

      return {
        message: data.message,
        course: data.data,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update course');
    }
  }
);

// Async thunk to delete course
export const deleteCourse = createAsyncThunk(
  'product-course-crud/:id/delete',
  async (
    { id, business_id }: { id: string; business_id: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.delete<GenericResponse>(
        `/product-course-crud/${id}`,
        {
          headers: {
            'Business-Id': business_id,
          },
        }
      );

      return {
        message: data.message,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete course');
    }
  }
);

// Async thunk to create bulk module with contents
export const createBulkModule = createAsyncThunk(
  'course-module/bulk',
  async (
    {
      credentials,
      business_id,
    }: { credentials: CreateModulesProps; business_id: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post<GenericResponse>(
        '/course-module/bulk',
        credentials,
        {
          headers: {
            'Business-Id': business_id,
          },
        }
      );

      return {
        message: data.message,
      };
    } catch (error: any) {
      // console.log(error);
      return rejectWithValue(
        error.response?.data || 'Failed to create modules'
      );
    }
  }
);

// Async thunk to fetch paginated modules
export const fetchModules = createAsyncThunk(
  'course-module/:id',
  async ({
    page,
    limit,
    q,
    startDate,
    endDate,
    business_id,
    course_id,
  }: {
    page?: number;
    limit?: number;
    q?: string;
    startDate?: string;
    endDate?: string;
    business_id?: string;
    course_id: string;
  }) => {
    const params: Record<string, any> = {};

    if (page !== undefined) params['pagination[page]'] = page;
    if (limit !== undefined) params['pagination[limit]'] = limit;
    if (q !== undefined) params.q = q;
    if (startDate !== undefined) params.startDate = startDate;
    if (endDate !== undefined) params.endDate = endDate;

    const headers: Record<string, string> = {};
    if (business_id) headers['Business-Id'] = business_id;

    const { data } = await api.get<ModuleResponse>(
      `/course-module/${course_id}`,
      {
        params,
        headers,
      }
    );

    return {
      modules: data.data,
      count: data.count,
    };
  }
);

// Async thunk to update bulk module with contents
export const updateBulkModule = createAsyncThunk(
  'course-module/bulk-update',
  async (
    {
      credentials,
      business_id,
    }: { credentials: UpdateModulesProps; business_id: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.patch<GenericResponse>(
        '/course-module/bulk-update',
        credentials,
        {
          headers: {
            'Business-Id': business_id,
          },
        }
      );

      return {
        message: data.message,
      };
    } catch (error: any) {
      // console.log(error);
      return rejectWithValue(
        error.response?.data || 'Failed to update modules'
      );
    }
  }
);

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPerPage: (state, action: PayloadAction<number>) => {
      // state.perPage = action.payload;
    },
    viewContent: (state, action: PayloadAction<ViewContentProps>) => {
      const { contentId, moduleId } = action.payload;
      const matchedModule = state.modules.find(
        (module) => module.id === moduleId
      );

      if (matchedModule) {
        state.content = matchedModule.contents.find(
          (content) => content.id === contentId
        ) as ModuleContent;
      } else {
        state.error = 'Module not found.';
      }
    },
    clearContent: (state) => {
      state.content = null;
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
      })
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.course = {
          ...state.course,
          ...action.payload.course,
        };
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update course';
      })
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete course';
      })
      .addCase(fetchCourses.pending, (state) => {
        state.coursesLoading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.coursesLoading = false;
        state.courses = action.payload.courses;
        state.coursesCount = action.payload.count;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.coursesLoading = false;
        state.error = action.error.message || 'Failed to fetch courses';
      })
      .addCase(fetchCourse.pending, (state) => {
        state.courseDetailsLoading = true;
        state.error = null;
      })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.courseDetailsLoading = false;
        state.course = action.payload.course;
      })
      .addCase(fetchCourse.rejected, (state, action) => {
        state.courseDetailsLoading = false;
        state.error = action.error.message || 'Failed to fetch course details';
      })
      .addCase(createBulkModule.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBulkModule.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createBulkModule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create bulk module';
      })
      .addCase(fetchModules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModules.fulfilled, (state, action) => {
        state.modulesLoading = false;
        state.modules = action.payload.modules;
        state.modulesCount = action.payload.count;
      })
      .addCase(fetchModules.rejected, (state, action) => {
        state.modulesLoading = false;
        state.error = action.error.message || 'Failed to fetch modules';
      })
      .addCase(updateBulkModule.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBulkModule.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateBulkModule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update bulk module';
      });
  },
});

export const { setPage, setPerPage, viewContent, clearContent } =
  courseSlice.actions;
export default courseSlice.reducer;
