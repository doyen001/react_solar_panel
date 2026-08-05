import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { INSTALLER_ACCESS_COOKIE } from "@/lib/auth/installer-cookies";
import { resolveChatWebSocketUrlForRequest } from "@/lib/server/chat-ws-url";

export async function GET(request: Request) {
  const jar = await cookies();
  const token = jar.get(INSTALLER_ACCESS_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const wsUrl = resolveChatWebSocketUrlForRequest(request, token);
  return NextResponse.json({ token, wsUrl });
}
