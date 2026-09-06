"use client";

import { doneProgress, startProgress } from "@/lib/progress/progressBar";

let patched = false;

/**
 * Wraps the global `fetch` once so every network call in the app — every
 * lib file's `fetchWithCustomerSession`/`fetchWithInstallerSession`/
 * `backendAuthedFetch`/plain `fetch`, all of them are built on this same
 * primitive — drives the top progress bar automatically. No per-call
 * instrumentation needed anywhere else.
 */
export function patchGlobalFetchForProgress() {
  if (patched || typeof window === "undefined") return;
  patched = true;

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (...args: Parameters<typeof fetch>) => {
    startProgress();
    try {
      return await originalFetch(...args);
    } finally {
      doneProgress();
    }
  };
}
