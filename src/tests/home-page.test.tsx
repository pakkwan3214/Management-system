import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("HomePage (primary route)", () => {
  it("renders the product name and a link to the dashboard", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: /dealership management system/i }),
    ).toBeInTheDocument();

    const dashboardLink = screen.getByRole("link", { name: /go to dashboard/i });
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute("href", "/dashboard");
  });
});
