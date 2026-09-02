import { NextResponse } from "next/server";
import { buildBackendUrl, extractMessage } from "@/lib/customers/backend";

/** Public — no session cookie involved, the token itself is the credential. */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!token) {
    return NextResponse.json({ message: "Missing verification token." }, { status: 400 });
  }

  const backendBaseUrl = process.env.BACKEND_API_BASE_URL;
  if (!backendBaseUrl) {
    return NextResponse.json(
      { message: "Server configuration is missing BACKEND_API_BASE_URL for verification." },
      { status: 500 },
    );
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(
      buildBackendUrl(backendBaseUrl, `/auth/verify-email/${encodeURIComponent(token)}`),
      { method: "GET", cache: "no-store" },
    );
  } catch (error) {
    console.error("verify-email fetch error", error);
    return NextResponse.json(
      { message: "Unable to reach the verification service." },
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
      { message: extractMessage(payload, "This verification link is invalid or has expired.") },
      { status: backendResponse.status },
    );
  }

  return NextResponse.json(
    { message: extractMessage(payload, "Email verified successfully.") },
    { status: 200 },
  );
}
