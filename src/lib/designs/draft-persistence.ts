import type { DesignProposalState } from "@/lib/store/designProposalSlice";

/**
 * A snapshot of the in-progress wizard, taken right before an anonymous
 * visitor's "Finish" attempt sends them to sign-in/sign-up because the save
 * needs an account.
 *
 * The designs page's Redux store is a live singleton that would otherwise
 * survive the trip through `/customers/auth` just fine (it's a client-side
 * route change, not a reload) — except the page deliberately resets that
 * store on a "fresh" visit with no `designId`/`customerId` context, to stop
 * a stale draft from an unrelated earlier session leaking into a new one.
 * That reset can't distinguish "fresh visitor" from "just came back from
 * signing in", so this snapshot is the explicit signal: only written right
 * before the auth redirect, read once on return, then cleared.
 *
 * `localStorage`, not `sessionStorage`: signing up (as opposed to just
 * signing in) requires verifying by email first, and that link is almost
 * always opened in a brand-new tab — `sessionStorage` wouldn't follow it
 * there, silently defeating the whole point for exactly the signup path.
 * `localStorage` is shared across tabs in the same browser, same origin.
 */
const DRAFT_KEY = "easylink:designs:anonymousDraft";

/** Ignore a draft nobody returned to collect — most likely an abandoned session, not a live return trip. */
const DRAFT_MAX_AGE_MS = 24 * 60 * 60 * 1000;

type StoredDraft = {
  savedAt: number;
  proposal: DesignProposalState;
};

export function saveDesignDraft(proposal: DesignProposalState): void {
  if (typeof window === "undefined") return;
  try {
    const stored: StoredDraft = { savedAt: Date.now(), proposal };
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(stored));
  } catch {
    // Storage full/unavailable (private browsing) — worst case the visitor
    // just gets the normal fresh-visit reset instead of a crash.
  }
}

export function loadDesignDraft(): DesignProposalState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as StoredDraft;
    if (Date.now() - stored.savedAt > DRAFT_MAX_AGE_MS) {
      window.localStorage.removeItem(DRAFT_KEY);
      return null;
    }
    return stored.proposal;
  } catch {
    return null;
  }
}

export function clearDesignDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}
