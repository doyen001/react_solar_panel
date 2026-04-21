import { NextResponse } from "next/server";
import { signUpSchema } from "@/lib/validations/auth";
import {
  buildBackendUrl,
  extractMessage,
} from "@/lib/customers/backend";

const SIGNUP_PATH = "/auth/register";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = signUpSchema.safeParse(body);

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
      {
        message:
          "Server configuration is missing BACKEND_API_BASE_URL for signup.",
      },
      { status: 500 },
    );
  }

  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  let backendResponse: Response;

  try {
    backendResponse = await fetch(
      buildBackendUrl(backendBaseUrl, SIGNUP_PATH),
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...parsed.data,
          role: "DESIGNER",
        }),
        cache: "no-store",
      },
    );
  } catch (error) {
    console.error("installer signup fetch error", error);
    return NextResponse.json(
      { message: "Unable to reach the signup service." },
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
    const fieldErrors =
      payload &&
      typeof payload === "object" &&
      "fieldErrors" in payload &&
      payload.fieldErrors &&
      typeof payload.fieldErrors === "object"
        ? payload.fieldErrors
        : undefined;

    return NextResponse.json(
      {
        message: extractMessage(
          payload,
          "Unable to create your account right now.",
        ),
        ...(fieldErrors ? { fieldErrors } : {}),
      },
      { status: backendResponse.status },
    );
  }

  return NextResponse.json(
    {
      message: extractMessage(
        payload,
        "Account created successfully. You can now sign in.",
      ),
      data: payload,
    },
    { status: backendResponse.status === 204 ? 200 : backendResponse.status },
  );
}
