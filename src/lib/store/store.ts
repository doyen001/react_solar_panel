import { configureStore, type Middleware } from "@reduxjs/toolkit";
import customerAuthReducer, {
  clearUser,
  CUSTOMER_AUTH_STORAGE_KEY,
  setUser,
} from "./customerAuthSlice";
import designProposalReducer from "./designProposalSlice";
import installerAuthReducer, {
  clearInstallerUser,
  INSTALLER_AUTH_STORAGE_KEY,
  setInstallerUser,
} from "./installerAuthSlice";

const customerAuthPersistenceMiddleware: Middleware = () => (next) => (action) => {
  const result = next(action);
  if (typeof window === "undefined") return result;
  if (setUser.match(action)) {
    sessionStorage.setItem(
      CUSTOMER_AUTH_STORAGE_KEY,
      JSON.stringify(action.payload),
    );
  } else if (clearUser.match(action)) {
    sessionStorage.removeItem(CUSTOMER_AUTH_STORAGE_KEY);
  }
  return result;
};

const installerAuthPersistenceMiddleware: Middleware =
  () => (next) => (action) => {
    const result = next(action);
    if (typeof window === "undefined") return result;
    if (setInstallerUser.match(action)) {
      sessionStorage.setItem(
        INSTALLER_AUTH_STORAGE_KEY,
        JSON.stringify(action.payload),
      );
    } else if (clearInstallerUser.match(action)) {
      sessionStorage.removeItem(INSTALLER_AUTH_STORAGE_KEY);
    }
    return result;
  };

export const store = configureStore({
  reducer: {
    customerAuth: customerAuthReducer,
    installerAuth: installerAuthReducer,
    designProposal: designProposalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      customerAuthPersistenceMiddleware,
      installerAuthPersistenceMiddleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
