import { describe, expect, it } from "vitest";
import { wsPayloadToDashboardItem } from "@/lib/notifications/ws-payload";

describe("wsPayloadToDashboardItem", () => {
  it("maps backend WS payload with null entity fields to empty strings", () => {
    const row = wsPayloadToDashboardItem({
      id: "n1",
      userId: "u1",
      type: "TEST",
      title: "Hi",
      body: "Body",
      entityType: null,
      entityId: null,
      readAt: null,
      createdAt: "2026-01-01T00:00:00.000Z",
    });
    expect(row).toEqual({
      id: "n1",
      userId: "u1",
      type: "TEST",
      title: "Hi",
      body: "Body",
      entityType: "",
      entityId: "",
      readAt: null,
      createdAt: "2026-01-01T00:00:00.000Z",
    });
  });

  it("returns null for invalid payloads", () => {
    expect(wsPayloadToDashboardItem(null)).toBeNull();
    expect(wsPayloadToDashboardItem({})).toBeNull();
    expect(wsPayloadToDashboardItem({ id: "x" })).toBeNull();
  });
});
