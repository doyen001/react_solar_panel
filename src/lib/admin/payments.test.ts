import { describe, expect, it, vi, beforeEach } from "vitest";

const fetchWithInstallerSession = vi.fn();

vi.mock("@/lib/installers/installer-fetch-client", () => ({
  fetchWithInstallerSession: (...args: unknown[]) =>
    fetchWithInstallerSession(...args),
}));

const { fetchAllPayments, markPaymentPaidOut } = await import("./payments");

function jsonResponse(body: unknown, ok = true, status = ok ? 200 : 400) {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

beforeEach(() => {
  fetchWithInstallerSession.mockReset();
});

describe("fetchAllPayments", () => {
  it("requests the master payments list with no filters by default", async () => {
    fetchWithInstallerSession.mockResolvedValue(jsonResponse({ success: true, data: [] }));

    await fetchAllPayments();

    expect(fetchWithInstallerSession).toHaveBeenCalledWith("/api/admin/payments");
  });

  it("serializes the provided filters as query params", async () => {
    fetchWithInstallerSession.mockResolvedValue(jsonResponse({ success: true, data: [] }));

    await fetchAllPayments({ status: "PAID", kind: "SERVICE", installerId: "inst-1", limit: 20 });

    const [url] = fetchWithInstallerSession.mock.calls[0] as [string];
    const params = new URL(url, "http://localhost").searchParams;
    expect(params.get("status")).toBe("PAID");
    expect(params.get("kind")).toBe("SERVICE");
    expect(params.get("installerId")).toBe("inst-1");
    expect(params.get("limit")).toBe("20");
  });

  it("throws the backend message on failure", async () => {
    fetchWithInstallerSession.mockResolvedValue(
      jsonResponse({ success: false, message: "Forbidden." }, false, 403),
    );

    await expect(fetchAllPayments()).rejects.toThrow("Forbidden.");
  });
});

describe("markPaymentPaidOut", () => {
  it("posts an empty body when no note is given", async () => {
    fetchWithInstallerSession.mockResolvedValue(
      jsonResponse({ success: true, data: { id: "pay_1", payoutStatus: "PAID_OUT" } }),
    );

    const result = await markPaymentPaidOut("pay_1");

    expect(result.payoutStatus).toBe("PAID_OUT");
    expect(fetchWithInstallerSession).toHaveBeenCalledWith(
      "/api/admin/payments/pay_1/payout",
      expect.objectContaining({ method: "POST", body: "{}" }),
    );
  });

  it("includes the note when one is given", async () => {
    fetchWithInstallerSession.mockResolvedValue(
      jsonResponse({ success: true, data: { id: "pay_1", payoutStatus: "PAID_OUT" } }),
    );

    await markPaymentPaidOut("pay_1", "Bank transfer ref #123");

    expect(fetchWithInstallerSession).toHaveBeenCalledWith(
      "/api/admin/payments/pay_1/payout",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ note: "Bank transfer ref #123" }),
      }),
    );
  });

  it("throws the backend message on failure", async () => {
    fetchWithInstallerSession.mockResolvedValue(
      jsonResponse(
        { success: false, message: "This payment has already been paid out." },
        false,
        409,
      ),
    );

    await expect(markPaymentPaidOut("pay_1")).rejects.toThrow(
      "This payment has already been paid out.",
    );
  });
});
