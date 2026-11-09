import { createSlice } from "@reduxjs/toolkit"

interface AuthState {
  isLoggedIn: boolean,
}

const initialState: AuthState = {
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logIn: (state) => {
      state.isLoggedIn = true;
    },
  }
});

export const { logIn } = authSlice.actions;
export default authSlice.reducer;