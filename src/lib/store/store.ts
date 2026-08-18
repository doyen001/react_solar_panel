import { configureStore, type Middleware } from "@reduxjs/toolkit";
import customerAuthReducer, {
  clearUser,
  CUSTOMER_AUTH_STORAGE_KEY,
  setCustomerSession,
  setUser,
} from "./customerAuthSlice";
import designProposalReducer from "./designProposalSlice";
import builderCatalogueReducer from "./builderCatalogueSlice";
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
import { readPersistedAuthPreload } from "./read-persisted-auth";

function hydrateStoreFromSessionStorage() {
  const preload = readPersistedAuthPreload();
  if (!preload) return;

  const state = store.getState();

  if (preload.customerAuth?.user && !state.customerAuth.user) {
    if (preload.customerAuth.accessToken) {
      store.dispatch(
        setCustomerSession({
          user: preload.customerAuth.user,
          accessToken: preload.customerAuth.accessToken,
        }),
      );
    } else {
      store.dispatch(setUser(preload.customerAuth.user));
    }
  }

  if (preload.installerAuth?.user && !state.installerAuth.user) {
    if (preload.installerAuth.accessToken) {
      store.dispatch(
        setInstallerSession({
          user: preload.installerAuth.user,
          accessToken: preload.installerAuth.accessToken,
        }),
      );
    } else {
      store.dispatch(setInstallerUser(preload.installerAuth.user));
    }
  }

  if (preload.adminAuth?.user && !state.adminAuth.user) {
    if (preload.adminAuth.accessToken) {
      store.dispatch(
        setAdminSession({
          user: preload.adminAuth.user,
          accessToken: preload.adminAuth.accessToken,
        }),
      );
    } else {
      store.dispatch(setAdminUser(preload.adminAuth.user));
    }
  }
}

export function hydrateAuthFromSessionStorage() {
  if (typeof window === "undefined") return;
  hydrateStoreFromSessionStorage();
}

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
    builderCatalogue: builderCatalogueReducer,
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
