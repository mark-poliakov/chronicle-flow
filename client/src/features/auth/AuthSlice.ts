import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit"
import { http, TOKEN_LOCAL_STORAGE_NAME } from "../../app/api/http";

interface AuthState {
  isLoggedIn: boolean,
  email?: string,
  token: string | null,
  status: 'idle' | 'loading' | 'suceeded' | 'failed',
  error: string | null,
}

export const register = createAsyncThunk('auth/register', (credentials: { email: string, password: string }) => {
  return http<{accessToken: string}>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
});

export const logIn = createAsyncThunk('auth/login', (credentials: { email: string, password: string }) => {
  return http<{accessToken: string}>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
});

export const getMe = createAsyncThunk('auth/me', () => {
  return http<{id: string, email: string}>('/auth/me');
});

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logOut: (state) => {
      state.isLoggedIn = false;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMe.fulfilled, (state, action) => {
        state.email = action.payload.email;
        state.status = 'suceeded';
        state.isLoggedIn = true;
      })
      .addMatcher(
        isAnyOf(register.fulfilled, logIn.fulfilled,),
        (state, action) => {
          state.token = action.payload.accessToken;
          state.status = 'suceeded';
          state.isLoggedIn = true;
          state.email = action.meta.arg.email;
          localStorage.setItem(TOKEN_LOCAL_STORAGE_NAME, action.payload.accessToken);
        }
      )

      .addMatcher(
        isAnyOf(
          register.pending, logIn.pending, getMe.pending,
        ),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          register.rejected, logIn.rejected, getMe.rejected,
        ),
        (state, action) => {
          state.token = null;
          localStorage.removeItem(TOKEN_LOCAL_STORAGE_NAME);
          state.status = 'failed';
          state.error = action.error.message ?? 'Request failed';
        }
      )
  },
});

export const { logOut } = authSlice.actions;
export default authSlice.reducer;