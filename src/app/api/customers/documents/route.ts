import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";

/** Backend ignores any customerId for the customer role and returns own documents only. */
export async function GET() {
  const res = await backendAuthedFetch("customer", "/installer-customer-documents");
  return forwardBackendJson(res);
}
