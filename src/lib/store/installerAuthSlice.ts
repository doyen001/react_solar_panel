import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { CustomerUser } from "@/lib/store/customerAuthSlice";

/** Same backend user payload as customer login; stored separately for installer portal. */
export type InstallerUser = CustomerUser;

export const INSTALLER_AUTH_STORAGE_KEY = "installer_auth_user";

export type InstallerAuthState = {
  user: InstallerUser | null;
};

const initialState: InstallerAuthState = {
  user: null,
};

const installerAuthSlice = createSlice({
  name: "installerAuth",
  initialState,
  reducers: {
    setInstallerUser: (state, action: PayloadAction<InstallerUser>) => {
      state.user = action.payload;
    },
    clearInstallerUser: (state) => {
      state.user = null;
    },
  },
});

export const { setInstallerUser, clearInstallerUser } =
  installerAuthSlice.actions;
export default installerAuthSlice.reducer;
