import { describe, expect, it, vi } from "vitest";

import DashboardPage from "@/app/dashboard/page";

vi.mock("@/lib/auth/session", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));

import { getCurrentUser } from "@/lib/auth/session";

const mockedGetCurrentUser = vi.mocked(getCurrentUser);

describe("DashboardPage", () => {
  it("renders for an authenticated user", async () => {
    mockedGetCurrentUser.mockResolvedValue({
      id: "test-user-id",
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      phone: null,
      profileImageUrl: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const page = await DashboardPage();

    expect(page).toBeDefined();
  });

  it("redirects unauthenticated users", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    await expect(DashboardPage()).rejects.toThrow("NEXT_REDIRECT");
  });
});
