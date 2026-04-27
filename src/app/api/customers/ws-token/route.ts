import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CUSTOMER_ACCESS_COOKIE } from "@/lib/auth/customer-cookies";

/** Returns the access JWT for opening a WebSocket to the backend (httpOnly cookie is not readable from client JS). */
export async function GET() {
  const jar = await cookies();
  const token = jar.get(CUSTOMER_ACCESS_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({ token });
}
