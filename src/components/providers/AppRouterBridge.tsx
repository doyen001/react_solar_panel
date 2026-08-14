"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { registerAppRouter } from "@/lib/auth/app-router-navigation";

export function AppRouterBridge({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    registerAppRouter(router);
  }, [router]);

  return children;
}
