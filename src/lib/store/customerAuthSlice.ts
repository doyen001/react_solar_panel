import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const CUSTOMER_AUTH_STORAGE_KEY = "customer_auth_user";

export type CustomerUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string | null;
  role: string;
  emailVerified: boolean;
};

export type CustomerAuthState = {
  user: CustomerUser | null;
};

const initialState: CustomerAuthState = {
  user: null,
};

const customerAuthSlice = createSlice({
  name: "customerAuth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<CustomerUser>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = customerAuthSlice.actions;
export default customerAuthSlice.reducer;
