"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import {
  CUSTOMER_AUTH_STORAGE_KEY,
  setUser,
  type CustomerUser,
} from "@/lib/store/customerAuthSlice";
import { store } from "@/lib/store/store";

function isCustomerUser(value: unknown): value is CustomerUser {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.email === "string" &&
    typeof o.firstName === "string" &&
    typeof o.lastName === "string" &&
    (o.address === null || typeof o.address === "string") &&
    typeof o.role === "string" &&
    typeof o.emailVerified === "boolean"
  );
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    try {
      const raw = sessionStorage.getItem(CUSTOMER_AUTH_STORAGE_KEY);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      if (isCustomerUser(parsed)) {
        store.dispatch(setUser(parsed));
      } else {
        sessionStorage.removeItem(CUSTOMER_AUTH_STORAGE_KEY);
      }
    } catch {
      sessionStorage.removeItem(CUSTOMER_AUTH_STORAGE_KEY);
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
