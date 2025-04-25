// features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  authorized: false,
  user: null,  // Add userId to state
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state) {
      state.authorized = true;
    },
    logout(state) {
      state.authorized = false;
      state.user = null;  // Clear userId on logout
    },
    setAuthorized(state, action) {
      state.authorized = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload; // Set userId in state
    },
  },
});

export const { login, logout, setAuthorized, setUser } = authSlice.actions;
export default authSlice.reducer;
