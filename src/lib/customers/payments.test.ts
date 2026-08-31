import { describe, expect, it, vi, beforeEach } from "vitest";

const fetchWithCustomerSession = vi.fn();

vi.mock("@/lib/customers/customer-fetch-client", () => ({
  fetchWithCustomerSession: (...args: unknown[]) =>
    fetchWithCustomerSession(...args),
}));

const { createProductCheckout, refreshCustomerPayment } = await import(
  "./payments"
);

function jsonResponse(body: unknown, ok = true, status = ok ? 200 : 400) {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

beforeEach(() => {
  fetchWithCustomerSession.mockReset();
});

describe("createProductCheckout", () => {
  it("posts the product and quantity, and returns the checkout session", async () => {
    const payment = { id: "pay_1", status: "PENDING" };
    fetchWithCustomerSession.mockResolvedValue(
      jsonResponse({
        success: true,
        data: { checkoutUrl: "https://stripe.test/session", sessionId: "cs_1", payment },
      }),
    );

    const result = await createProductCheckout({
      productId: "11111111-1111-4111-8111-111111111111",
      quantity: 2,
    });

    expect(result.checkoutUrl).toBe("https://stripe.test/session");
    expect(fetchWithCustomerSession).toHaveBeenCalledWith(
      "/api/customers/payments/products/checkout",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          productId: "11111111-1111-4111-8111-111111111111",
          quantity: 2,
        }),
      }),
    );
  });

  it("throws when the response has no checkout URL", async () => {
    fetchWithCustomerSession.mockResolvedValue(
      jsonResponse({ success: true, data: { checkoutUrl: "", sessionId: "cs_1", payment: {} } }),
    );

    await expect(
      createProductCheckout({ productId: "id", quantity: 1 }),
    ).rejects.toThrow("Invalid checkout response");
  });

  it("surfaces the backend error message on failure", async () => {
    fetchWithCustomerSession.mockResolvedValue(
      jsonResponse({ success: false, message: "This product is not available for purchase." }, false, 404),
    );

    await expect(
      createProductCheckout({ productId: "id", quantity: 1 }),
    ).rejects.toThrow("This product is not available for purchase.");
  });
});

describe("refreshCustomerPayment", () => {
  it("returns the refreshed payment", async () => {
    fetchWithCustomerSession.mockResolvedValue(
      jsonResponse({ success: true, data: { id: "pay_1", status: "PAID" } }),
    );

    const result = await refreshCustomerPayment("pay_1");
    expect(result.status).toBe("PAID");
    expect(fetchWithCustomerSession).toHaveBeenCalledWith(
      "/api/customers/payments/pay_1/refresh",
      { method: "POST" },
    );
  });

  it("throws a fallback message when the envelope has no data", async () => {
    fetchWithCustomerSession.mockResolvedValue(jsonResponse({ success: true }));

    await expect(refreshCustomerPayment("pay_1")).rejects.toThrow(
      "Could not refresh payment",
    );
  });
});
