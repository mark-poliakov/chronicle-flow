import { configureStore } from '@reduxjs/toolkit';
import diaryReducer from '../features/diary/diarySlice';
import authReducer from '../features/auth/AuthSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    diary: diaryReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;