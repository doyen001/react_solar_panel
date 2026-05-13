import { configureStore, type Middleware } from "@reduxjs/toolkit";
import customerAuthReducer, {
  clearUser,
  CUSTOMER_AUTH_STORAGE_KEY,
  setCustomerSession,
  setUser,
} from "./customerAuthSlice";
import designProposalReducer from "./designProposalSlice";
import solarMaintenanceContractReducer from "./solarMaintenanceContractSlice";
import installerAuthReducer, {
  clearInstallerUser,
  INSTALLER_AUTH_STORAGE_KEY,
  setInstallerSession,
  setInstallerUser,
} from "./installerAuthSlice";
import adminAuthReducer, {
  clearAdminUser,
  ADMIN_AUTH_STORAGE_KEY,
  setAdminSession,
  setAdminUser,
} from "./adminAuthSlice";

const customerAuthPersistenceMiddleware: Middleware = () => (next) => (action) => {
  const result = next(action);
  if (typeof window === "undefined") return result;
  if (setCustomerSession.match(action)) {
    sessionStorage.setItem(
      CUSTOMER_AUTH_STORAGE_KEY,
      JSON.stringify(action.payload),
    );
  } else if (setUser.match(action)) {
    sessionStorage.setItem(
      CUSTOMER_AUTH_STORAGE_KEY,
      JSON.stringify({ user: action.payload, accessToken: null }),
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
    if (setInstallerSession.match(action)) {
      sessionStorage.setItem(
        INSTALLER_AUTH_STORAGE_KEY,
        JSON.stringify(action.payload),
      );
    } else if (setInstallerUser.match(action)) {
      sessionStorage.setItem(
        INSTALLER_AUTH_STORAGE_KEY,
        JSON.stringify({ user: action.payload, accessToken: null }),
      );
    } else if (clearInstallerUser.match(action)) {
      sessionStorage.removeItem(INSTALLER_AUTH_STORAGE_KEY);
    }
    return result;
  };

const adminAuthPersistenceMiddleware: Middleware =
  () => (next) => (action) => {
    const result = next(action);
    if (typeof window === "undefined") return result;
    if (setAdminSession.match(action)) {
      sessionStorage.setItem(
        ADMIN_AUTH_STORAGE_KEY,
        JSON.stringify(action.payload),
      );
    } else if (setAdminUser.match(action)) {
      sessionStorage.setItem(
        ADMIN_AUTH_STORAGE_KEY,
        JSON.stringify({ user: action.payload, accessToken: null }),
      );
    } else if (clearAdminUser.match(action)) {
      sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    }
    return result;
  };

export const store = configureStore({
  reducer: {
    customerAuth: customerAuthReducer,
    installerAuth: installerAuthReducer,
    adminAuth: adminAuthReducer,
    designProposal: designProposalReducer,
    solarMaintenanceContract: solarMaintenanceContractReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      customerAuthPersistenceMiddleware,
      installerAuthPersistenceMiddleware,
      adminAuthPersistenceMiddleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
