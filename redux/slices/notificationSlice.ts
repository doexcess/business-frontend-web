import api from '@/lib/api';
import { ScheduleEmailProps } from '@/lib/schema/notification.schema';
import { NotificationType } from '@/lib/utils';
import {
  InstantNotification,
  InstantNotificationResponse,
  NotificationDetails,
  NotificationDetailsResponse,
  ScheduledNotification,
  ScheduledNotificationResponse,
} from '@/types/notification';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface EmailNotificationState {
  loading: boolean;
  error: string | null;
  instantNotifications: InstantNotification[];
  instantNotificationLoading: boolean;
  scheduledNotifications: ScheduledNotification[];
  scheduledNotificationLoading: boolean;
  countInstantNotifications: number;
  countScheduledNotifications: number;
  notification: NotificationDetails | null;
  notificationLoading: boolean;
}

const initialState: EmailNotificationState = {
  loading: false,
  error: null,
  instantNotifications: [],
  instantNotificationLoading: false,
  scheduledNotifications: [],
  scheduledNotificationLoading: false,
  countInstantNotifications: 0,
  countScheduledNotifications: 0,
  notification: null,
  notificationLoading: false,
};

// Async Thunk for a single email notification dispatch
export const composeEmail = createAsyncThunk(
  'notification-dispatch/create',
  async (
    credentials: {
      title: string;
      message: string;
      type: NotificationType;
      is_scheduled: boolean;
      recipients: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        '/notification-dispatch/create',
        credentials
      );
      const { message } = response.data;
      return { message };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Notification dispatch failed'
      );
    }
  }
);

// Async Thunk for fetching all instant notifications
export const fetchInstant = createAsyncThunk(
  'notification-track/instant/:business_id',
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
    const params: Record<string, any> = {};

    if (page !== undefined) params['pagination[page]'] = page;
    if (limit !== undefined) params['pagination[limit]'] = limit;
    if (q !== undefined) params['q'] = q;
    if (startDate !== undefined) params['startDate'] = startDate;
    if (endDate !== undefined) params['endDate'] = endDate;

    try {
      const { data } = await api.get<InstantNotificationResponse>(
        `/notification-track/instant/${business_id}`,
        {
          params,
        }
      );

      return {
        notifications: data.data,
        count: data.count,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Failed to fetch all instant notifications'
      );
    }
  }
);

// Async Thunk for a scheduled email notification dispatch
export const scheduleEmail = createAsyncThunk(
  'notification-dispatch/initiate-schedule',
  async (credentials: ScheduleEmailProps, { rejectWithValue }) => {
    try {
      const response = await api.post(
        '/notification-dispatch/initiate-schedule',
        credentials
      );
      const { message } = response.data;
      return { message };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Notification schedule dispatch failed'
      );
    }
  }
);

// Async Thunk for fetching all scheduled notifications
export const fetchScheduled = createAsyncThunk(
  'notification-dispatch/fetch-scheduled',
  async (
    {
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
    },
    { rejectWithValue }
  ) => {
    const params: Record<string, any> = {};

    if (page !== undefined) params['pagination[page]'] = page;
    if (limit !== undefined) params['pagination[limit]'] = limit;
    if (q !== undefined) params['q'] = q;
    if (startDate !== undefined) params['startDate'] = startDate;
    if (endDate !== undefined) params['endDate'] = endDate;

    try {
      const { data } = await api.get<ScheduledNotificationResponse>(
        `/notification-track/fetch-scheduled`,
        {
          params,
        }
      );

      return {
        notifications: data.data,
        count: data.count,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Failed to fetch all scheduled notifications'
      );
    }
  }
);

// Async Thunk for fetching notification details
export const fetchSingleNotification = createAsyncThunk(
  'notification-track/single/:id',
  async (
    {
      id,
      business_id,
    }: {
      id: string;
      business_id?: string;
    },
    { rejectWithValue }
  ) => {
    const headers: Record<string, any> = {};

    if (business_id) headers['Business-Id'] = business_id;

    try {
      const { data } = await api.get<NotificationDetailsResponse>(
        `/notification-track/single/${id}`,
        {
          headers,
        }
      );

      return {
        notification: data.data,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Failed to fetch single notification details'
      );
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(composeEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(composeEmail.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(composeEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchInstant.pending, (state) => {
        state.instantNotificationLoading = true;
        state.error = null;
      })
      .addCase(fetchInstant.fulfilled, (state, action) => {
        state.instantNotificationLoading = false;
        state.instantNotifications = action.payload.notifications;
        state.countInstantNotifications = action.payload.count;
      })
      .addCase(fetchInstant.rejected, (state, action) => {
        state.instantNotificationLoading = false;
        state.error = action.payload as string;
      })
      .addCase(scheduleEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(scheduleEmail.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(scheduleEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchScheduled.pending, (state) => {
        state.scheduledNotificationLoading = true;
        state.error = null;
      })
      .addCase(fetchScheduled.fulfilled, (state, action) => {
        state.scheduledNotificationLoading = false;
        state.scheduledNotifications = action.payload.notifications;
        state.countScheduledNotifications = action.payload.count;
      })
      .addCase(fetchScheduled.rejected, (state, action) => {
        state.scheduledNotificationLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSingleNotification.pending, (state) => {
        state.scheduledNotificationLoading = true;
        state.error = null;
      })
      .addCase(fetchSingleNotification.fulfilled, (state, action) => {
        state.notificationLoading = false;
        state.notification = action.payload.notification;
      })
      .addCase(fetchSingleNotification.rejected, (state, action) => {
        state.notificationLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default notificationSlice.reducer;
