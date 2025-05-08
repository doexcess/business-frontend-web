import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import storage from 'redux-persist/lib/storage'; // Uses localStorage
import { persistReducer } from 'redux-persist';

// Persist configuration for auth slice only
const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['auth'], // Only persist the auth slice
};

// Combine reducers
const rootReducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer),
  chat: chatReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
