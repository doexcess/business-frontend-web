import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import courseReducer from './slices/courseSlice';
import ticketReducer from './slices/ticketSlice';
import orgReducer from './slices/orgSlice';
import paymentReducer from './slices/paymentSlice';
import withdrawalReducer from './slices/withdrawalSlice';
import couponReducer from './slices/couponSlice';
import subscriptionPlanReducer from './slices/subscriptionPlanSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import notificationReducer from './slices/notificationSlice';
import productImportReducer from './slices/productImportSlice';
import analyticsReducer from './slices/analyticsSlice';
import productReducer from './slices/productSlice';
import digitalProductReducer from './slices/digitalProductSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import firebaseReducer from './slices/firebaseSlice';
import currencyReducer from './slices/currencySlice';
import { persistReducer } from 'redux-persist';
// Use a safe storage that doesn't touch window during SSR/static export
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null as any);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// Dynamically resolve storage backend based on environment
const persistStorage =
  typeof window !== 'undefined'
    ? require('redux-persist/lib/storage').default
    : createNoopStorage();

// Persist configuration for auth slice only
const persistConfig = {
  key: 'auth',
  storage: persistStorage,
  whitelist: ['auth', 'org', 'cart'], // Only persist the auth slice
};

// Combine reducers
const rootReducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer),
  chat: chatReducer,
  course: courseReducer,
  ticket: ticketReducer,
  org: persistReducer(persistConfig, orgReducer),
  payment: paymentReducer,
  withdrawal: withdrawalReducer,
  coupon: couponReducer, // Not persisted
  subscriptionPlan: subscriptionPlanReducer, // Not persisted
  subscription: subscriptionReducer, // Not persisted
  notification: notificationReducer, // Not persisted
  productImport: productImportReducer,
  analytics: analyticsReducer,
  products: productReducer,
  digitalProduct: digitalProductReducer,
  cart: persistReducer(persistConfig, cartReducer),
  order: orderReducer, // Not persisted
  firebase: firebaseReducer,
  currency: currencyReducer,
});

const loggerMiddleware = (store: any) => (next: any) => (action: any) => {
  console.log('Dispatching:', action);
  let result = next(action);
  // console.log('Next state:', store.getState());
  // console.log('📊 New state:', store.getState().chat); // 👈 only chat slice
  return result;
};

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
