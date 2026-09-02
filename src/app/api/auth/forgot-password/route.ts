import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { buildBackendUrl, extractMessage } from "@/lib/customers/backend";

/** Public — no session cookie involved. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const parsed = forgotPasswordSchema.safeParse(body);
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
    backendResponse = await fetch(buildBackendUrl(backendBaseUrl, "/auth/forgot-password"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });
  } catch (error) {
    console.error("forgot-password fetch error", error);
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

  // The backend's own service layer already returns the same 200 + generic
  // message whether or not the email is registered, so this just forwards
  // it as-is — a real 4xx/5xx (validation, outage) still surfaces normally.
  return NextResponse.json(
    { message: extractMessage(payload, "If that email exists, a reset link has been sent.") },
    { status: backendResponse.status },
  );
}
