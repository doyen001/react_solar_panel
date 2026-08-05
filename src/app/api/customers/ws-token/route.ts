import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CUSTOMER_ACCESS_COOKIE } from "@/lib/auth/customer-cookies";
import { resolveChatWebSocketUrlForRequest } from "@/lib/server/chat-ws-url";

/** Returns the access JWT and WebSocket URL for the backend chat gateway. */
export async function GET(request: Request) {
  const jar = await cookies();
  const token = jar.get(CUSTOMER_ACCESS_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const wsUrl = resolveChatWebSocketUrlForRequest(request, token);
  return NextResponse.json({ token, wsUrl });
}
