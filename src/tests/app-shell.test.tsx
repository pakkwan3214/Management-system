import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AppShell } from "@/components/layout/AppShell";

describe("AppShell", () => {
  it("renders the header, navigation, and main content area", () => {
    render(
      <AppShell>
        <p>page content</p>
      </AppShell>,
    );

    expect(screen.getByText(/dealership management system/i)).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /primary/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute("href", "/dashboard");
    expect(screen.getByTestId("main-content")).toHaveTextContent("page content");
  });

  it("toggles the mobile sidebar when the menu button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <AppShell>
        <p>page content</p>
      </AppShell>,
    );

    const nav = screen.getByRole("navigation", { name: /primary/i });
    expect(nav).toHaveAttribute("data-state", "closed");

    await user.click(screen.getByRole("button", { name: /toggle navigation menu/i }));
    expect(nav).toHaveAttribute("data-state", "open");
  });
});
