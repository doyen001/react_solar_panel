"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  fetchInstallerCustomers,
  invalidateInstallerCustomerListCache,
  type InstallerCustomerSummary,
} from "@/lib/installers/customers";

type InstallerCustomersContextValue = {
  customers: InstallerCustomerSummary[];
  loading: boolean;
  refetch: () => void;
};

const InstallerCustomersContext =
  createContext<InstallerCustomersContextValue | null>(null);

const LEAD_LINKED_LIST_PARAMS = {
  limit: 100,
  leadLinkedOnly: true,
} as const;

export function InstallerCustomersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [customers, setCustomers] = useState<InstallerCustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setLoading(true);
    try {
      const rows = await fetchInstallerCustomers(LEAD_LINKED_LIST_PARAMS);
      setCustomers(rows);
    } catch {
      /* keep previous list on transient errors */
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const refetch = useCallback(() => {
    invalidateInstallerCustomerListCache(LEAD_LINKED_LIST_PARAMS);
    void load({ silent: customers.length > 0 });
  }, [customers.length, load]);

  const value = useMemo(
    () => ({ customers, loading, refetch }),
    [customers, loading, refetch],
  );

  return (
    <InstallerCustomersContext.Provider value={value}>
      {children}
    </InstallerCustomersContext.Provider>
  );
}

export function useInstallerCustomers(): InstallerCustomersContextValue {
  const ctx = useContext(InstallerCustomersContext);
  if (!ctx) {
    throw new Error(
      "useInstallerCustomers must be used within InstallerCustomersProvider",
    );
  }
  return ctx;
}

/** For components that may render outside the provider (optional prop fallback). */
export function useInstallerCustomersOptional() {
  return useContext(InstallerCustomersContext);
}
