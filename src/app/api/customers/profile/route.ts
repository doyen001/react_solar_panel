import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";

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
