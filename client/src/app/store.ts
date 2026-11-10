import { configureStore } from '@reduxjs/toolkit';
import diaryReducer from '../features/diary/diarySlice';
import authReducer from '../features/auth/authSlice';
import dropdownReducer from '../components/dropdownSlice';
import modalReducer from '../components/modalSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    diary: diaryReducer,
    dropdown: dropdownReducer,
    modal: modalReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;