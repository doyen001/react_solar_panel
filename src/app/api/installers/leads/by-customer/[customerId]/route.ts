import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ customerId: string }> },
) {
  const { customerId } = await params;
  const res = await backendAuthedFetch(
    "installer",
    `/leads/by-customer/${encodeURIComponent(customerId)}`,
  );
  return forwardBackendJson(res);
}
