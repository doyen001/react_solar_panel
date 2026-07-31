import { unlink } from "node:fs/promises";
import {
  backendAuthedFetch,
  forwardBackendJson,
} from "@/lib/server/backend-authed-fetch";
import { customerDocumentPathFromUrl } from "@/lib/server/customer-document-upload";

type Ctx = { params: Promise<{ id: string }> };

type DeletePayload = {
  success?: boolean;
  message?: string;
  data?: { url?: string };
};

export async function DELETE(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const res = await backendAuthedFetch(
    "installer",
    `/installer-customer-documents/${id}`,
    { method: "DELETE" },
  );

  const text = await res.text();
  let payload: DeletePayload | null = null;
  if (text) {
    try {
      payload = JSON.parse(text) as DeletePayload;
    } catch {
      payload = null;
    }
  }

  if (res.ok && payload?.data?.url) {
    const filePath = customerDocumentPathFromUrl(payload.data.url);
    if (filePath) {
      try {
        await unlink(filePath);
      } catch {
        /* file may already be gone */
      }
    }
  }

  return new Response(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
