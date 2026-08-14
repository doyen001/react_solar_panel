"use client";

import { useLayoutEffect, useRef } from "react";
import { Provider } from "react-redux";
import { AppRouterBridge } from "@/components/providers/AppRouterBridge";
import { hydrateAuthFromSessionStorage, store } from "@/lib/store/store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useRef(false);

  useLayoutEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    hydrateAuthFromSessionStorage();
  }, []);

  return (
    <Provider store={store}>
      <AppRouterBridge>{children}</AppRouterBridge>
    </Provider>
  );
}
