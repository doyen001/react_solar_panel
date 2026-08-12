import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";

/**
 * The signed-in customer, from the session cookie.
 *
 * Redux auth is persisted in sessionStorage, so a fresh tab or a direct link
 * has no user even though the cookie still authenticates. This lets the client
 * recover that state instead of behaving as though nobody is signed in.
 */
export async function GET() {
  const res = await backendAuthedFetch("customer", "/users/me");
  return forwardBackendJson(res);
}

/**
 * Self-update for the signed-in customer. Backed by `PATCH /users/me`, so the
 * server derives the user from the token — no id travels from the client.
 */
export async function PATCH(request: Request) {
  const body = await request.text();
  const res = await backendAuthedFetch("customer", "/users/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  });
  return forwardBackendJson(res);
}
