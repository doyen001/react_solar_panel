"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import {
  setCustomerSession,
  setUser,
} from "@/lib/store/customerAuthSlice";
import {
  setInstallerSession,
  setInstallerUser,
} from "@/lib/store/installerAuthSlice";
import {
  setAdminSession,
  setAdminUser,
} from "@/lib/store/adminAuthSlice";
import { readPersistedAuthPreload } from "@/lib/store/read-persisted-auth";
import { store } from "@/lib/store/store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const preload = readPersistedAuthPreload();
    if (!preload) return;

    const state = store.getState();

    if (
      preload.customerAuth?.user &&
      !state.customerAuth.user
    ) {
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

    if (
      preload.installerAuth?.user &&
      !state.installerAuth.user
    ) {
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
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
