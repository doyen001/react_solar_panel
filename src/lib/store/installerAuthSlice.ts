import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { CustomerUser } from "@/lib/store/customerAuthSlice";

/** Same backend user payload as customer login; stored separately for installer portal. */
export type InstallerUser = CustomerUser;

export const INSTALLER_AUTH_STORAGE_KEY = "installer_auth_user";

export type InstallerAuthState = {
  user: InstallerUser | null;
  accessToken: string | null;
};

const initialState: InstallerAuthState = {
  user: null,
  accessToken: null,
};

const installerAuthSlice = createSlice({
  name: "installerAuth",
  initialState,
  reducers: {
    setInstallerUser: (state, action: PayloadAction<InstallerUser>) => {
      state.user = action.payload;
    },
    setInstallerSession: (
      state,
      action: PayloadAction<{ user: InstallerUser; accessToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    setInstallerAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
    clearInstallerUser: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const {
  setInstallerUser,
  setInstallerSession,
  setInstallerAccessToken,
  clearInstallerUser,
} = installerAuthSlice.actions;
export default installerAuthSlice.reducer;
