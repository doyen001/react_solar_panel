"use client";

type AppRouter = {
  push: (href: string) => void;
  refresh: () => void;
};

let appRouter: AppRouter | null = null;

/** Registered once from {@link AppRouterBridge} so non-component modules can navigate. */
export function registerAppRouter(router: AppRouter) {
  appRouter = router;
}

/**
 * Client navigation after auth cookie changes.
 * httpOnly cookies are not readable in JS (by design); the browser stores them
 * from the login `fetch` response and sends them on the next request.
 * `router.refresh()` re-runs App Router server work (middleware / RSC) with that cookie jar.
 */
export function navigateWithSessionRefresh(href: string) {
  if (appRouter) {
    appRouter.push(href);
    appRouter.refresh();
    return;
  }
  if (typeof window !== "undefined") {
    window.location.assign(href);
  }
}
