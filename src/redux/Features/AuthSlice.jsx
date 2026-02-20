// [file name]: src/redux/Features/AuthSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isLogged: false,
  role: null,
  UserId: null,
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLogged = true;
      state.role = action.payload.role;
      state.UserId = action.payload.UserId;
      
      // Save to localStorage for persistence
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("role", action.payload.role);
      localStorage.setItem("UserId", action.payload.UserId);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLogged = false;
      state.role = null;
      state.UserId = null;
      
      // Clear localStorage
      localStorage.clear();
    },
    // Add this to restore state from localStorage on app load
    restoreState: (state) => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      const role = localStorage.getItem("role");
      const UserId = localStorage.getItem("UserId");

      if (token && user && role && UserId) {
        state.user = JSON.parse(user);
        state.token = token;
        state.isLogged = true;
        state.role = role;
        state.UserId = UserId;
      }
    },
  },
});

export const { login, logout, restoreState } = AuthSlice.actions;
export default AuthSlice.reducer;