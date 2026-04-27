import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { INSTALLER_ACCESS_COOKIE } from "@/lib/auth/installer-cookies";

export async function GET() {
  const jar = await cookies();
  const token = jar.get(INSTALLER_ACCESS_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({ token });
}
