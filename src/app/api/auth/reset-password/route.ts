import { NextResponse } from "next/server";
import { z } from "zod";
import { buildBackendUrl, extractMessage } from "@/lib/customers/backend";

// The token rides along in the body here (not validated by the shared
// resetPasswordSchema, which only covers the password/confirm pair the form
// collects) — kept as its own minimal schema so a missing token 400s clearly.
const proxyBodySchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/** Public — the reset token itself is the credential, no session cookie involved. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const parsed = proxyBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Please correct the highlighted fields.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const backendBaseUrl = process.env.BACKEND_API_BASE_URL;
  if (!backendBaseUrl) {
    return NextResponse.json(
      { message: "Server configuration is missing BACKEND_API_BASE_URL for password reset." },
      { status: 500 },
    );
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(buildBackendUrl(backendBaseUrl, "/auth/reset-password"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });
  } catch (error) {
    console.error("reset-password fetch error", error);
    return NextResponse.json(
      { message: "Unable to reach the password reset service." },
      { status: 502 },
    );
  }

  const responseText = await backendResponse.text();
  let payload: unknown = null;
  if (responseText) {
    try {
      payload = JSON.parse(responseText);
    } catch {
      payload = null;
    }
  }

  if (!backendResponse.ok) {
    return NextResponse.json(
      { message: extractMessage(payload, "This reset link is invalid or has expired.") },
      { status: backendResponse.status },
    );
  }

  return NextResponse.json(
    { message: extractMessage(payload, "Password reset successfully.") },
    { status: 200 },
  );
}
