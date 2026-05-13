import { NextResponse } from "next/server";
import { clearAdminAuthCookies } from "@/lib/auth/admin-cookies";
import { clearInstallerAuthCookies } from "@/lib/auth/installer-cookies";

export async function POST() {
  const res = NextResponse.json(
    { message: "Signed out." },
    { status: 200 },
  );
  // Admin login sets both admin and installer cookies (see /api/admin/login
  // for the rationale). Clear both on logout so no stale auth lingers.
  clearAdminAuthCookies(res);
  clearInstallerAuthCookies(res);
  return res;
}
