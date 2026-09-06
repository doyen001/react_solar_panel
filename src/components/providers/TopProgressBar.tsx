"use client";

import { useSyncExternalStore } from "react";
import { patchGlobalFetchForProgress } from "@/lib/progress/patchFetch";
import {
  getProgressServerSnapshot,
  getProgressSnapshot,
  subscribeProgress,
} from "@/lib/progress/progressBar";

// Runs once, when this client module is first evaluated in the browser —
// not inside an effect, so it isn't subject to React StrictMode's
// double-invoke (the `patched` guard inside makes it idempotent regardless).
patchGlobalFetchForProgress();

/**
 * A thin bar across the very top of the viewport that fills while any
 * fetch is in flight, sitting above every dialog/modal in the app
 * (those top out at z-100) so it's always visible.
 */
export function TopProgressBar() {
  const { percent, visible } = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getProgressServerSnapshot,
  );

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-200 h-[3px]"
    >
      <div
        className="h-full bg-linear-to-r from-yellow-lemon to-orange-amber shadow-[0_0_8px_rgba(247,141,0,0.6)] transition-[width] duration-200 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
