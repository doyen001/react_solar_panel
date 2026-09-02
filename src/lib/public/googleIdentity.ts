"use client";

// Minimal surface of the Google Identity Services API this file actually
// uses — the real script attaches `window.google` at runtime, no npm
// package involved.
type GoogleIdCredentialResponse = { credential: string };
type GoogleAccountsId = {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleIdCredentialResponse) => void;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      type?: "standard" | "icon";
      theme?: "outline" | "filled_blue" | "filled_black";
      size?: "large" | "medium" | "small";
      text?: "signin_with" | "signup_with" | "continue_with";
      shape?: "rectangular" | "pill" | "circle" | "square";
      width?: number;
    },
  ) => void;
};

declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } };
  }
}

const SCRIPT_SRC = "https://accounts.google.com/gsi/client";
let scriptLoadPromise: Promise<void> | null = null;

/** Loads the Google Identity Services script once, however many callers ask for it. */
function loadGoogleIdentityScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google sign-in is only available in the browser."));
  }
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }
  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  scriptLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Could not load Google sign-in.")),
      );
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Google sign-in."));
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

/**
 * Renders Google's own "Sign in with Google" button into `container`.
 * `onIdToken` fires once with the signed ID token when the visitor
 * completes sign-in — verify it server-side, never trust it as-is client-side.
 */
export async function renderGoogleSignInButton(
  container: HTMLElement,
  clientId: string,
  onIdToken: (idToken: string) => void,
): Promise<void> {
  if (!clientId) {
    throw new Error("Google sign-in is not configured for this site.");
  }
  await loadGoogleIdentityScript();
  const accountsId = window.google?.accounts.id;
  if (!accountsId) {
    throw new Error("Google sign-in script did not load correctly.");
  }

  accountsId.initialize({
    client_id: clientId,
    callback: (response) => onIdToken(response.credential),
  });
  accountsId.renderButton(container, {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "continue_with",
    shape: "pill",
    width: 280,
  });
}
