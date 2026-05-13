import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { CustomerUser } from "@/lib/store/customerAuthSlice";

/** Admin users share the same backend user payload shape. */
export type AdminUser = CustomerUser;

export const ADMIN_AUTH_STORAGE_KEY = "admin_auth_user";

export type AdminAuthState = {
  user: AdminUser | null;
  accessToken: string | null;
};

const initialState: AdminAuthState = {
  user: null,
  accessToken: null,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAdminUser: (state, action: PayloadAction<AdminUser>) => {
      state.user = action.payload;
    },
    setAdminSession: (
      state,
      action: PayloadAction<{ user: AdminUser; accessToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    setAdminAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
    clearAdminUser: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const {
  setAdminUser,
  setAdminSession,
  setAdminAccessToken,
  clearAdminUser,
} = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
