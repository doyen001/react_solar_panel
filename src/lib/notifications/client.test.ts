import { describe, expect, it, vi } from "vitest";
import {
  fetchDashboardNotifications,
  markAllDashboardNotificationsRead,
  markDashboardNotificationRead,
} from "@/lib/notifications/client";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("notifications client (dashboard API shape)", () => {
  it("fetchDashboardNotifications returns items and meta unreadCount", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        success: true,
        data: [
          {
            id: "n1",
            userId: "u1",
            type: "LEAD_ASSIGNED",
            title: "New lead",
            body: "You have a new lead",
            entityType: "LEAD",
            entityId: "lead-1",
            readAt: null,
            createdAt: "2026-01-01T00:00:00.000Z",
          },
        ],
        meta: { unreadCount: 2 },
      }),
    );

    const result = await fetchDashboardNotifications(
      "/api/installers/notifications",
      fetchMock,
      { limit: 10, unreadOnly: true },
    );

    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.id).toBe("n1");
    expect(result.unreadCount).toBe(2);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/installers/notifications?unreadOnly=true&limit=10",
      expect.objectContaining({ cache: "no-store" }),
    );
  });

  it("fetchDashboardNotifications throws with backend message on failure", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({ success: false, message: "Not allowed" }, 403),
    );

    await expect(
      fetchDashboardNotifications("/api/installers/notifications", fetchMock),
    ).rejects.toThrow("Not allowed");
  });

  it("markDashboardNotificationRead returns data row", async () => {
    const row = {
      id: "n1",
      userId: "u1",
      type: "LEAD_ASSIGNED",
      title: "t",
      body: "b",
      entityType: "LEAD",
      entityId: "lead-1",
      readAt: "2026-05-01T12:00:00.000Z",
      createdAt: "2026-01-01T00:00:00.000Z",
    };
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({ success: true, data: row }),
    );

    const out = await markDashboardNotificationRead(
      "/api/installers/notifications",
      fetchMock,
      "aaaaaaaa-bbbb-4ccc-dddd-eeeeeeeeeeee",
    );

    expect(out).toEqual(row);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/installers/notifications/aaaaaaaa-bbbb-4ccc-dddd-eeeeeeeeeeee/read",
      expect.objectContaining({ method: "PATCH", cache: "no-store" }),
    );
  });

  it("markAllDashboardNotificationsRead returns updated count", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({ success: true, data: { updated: 4 } }),
    );

    const out = await markAllDashboardNotificationsRead(
      "/api/installers/notifications",
      fetchMock,
    );

    expect(out).toEqual({ updated: 4 });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/installers/notifications/read-all",
      expect.objectContaining({ method: "PATCH", cache: "no-store" }),
    );
  });
});
