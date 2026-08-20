import { describe, expect, it } from "vitest";

import { getDashboardWidgets } from "@/lib/dashboard/dashboard-config";

describe("getDashboardWidgets", () => {
  it("includes all base widgets for every authenticated user", () => {
    const widgets = getDashboardWidgets([]);

    const widgetIds = widgets.map((widget) => widget.id);

    expect(widgetIds).toContain("tasks");
    expect(widgetIds).toContain("activity");
    expect(widgetIds).toContain("notifications");
  });

  it("shows the inventory widget only with inventory.view", () => {
    const withoutPermission = getDashboardWidgets([]);
    const withPermission = getDashboardWidgets(["inventory.view"]);

    expect(
      withoutPermission.some((widget) => widget.id === "inventory"),
    ).toBe(false);

    expect(
      withPermission.some((widget) => widget.id === "inventory"),
    ).toBe(true);
  });

  it("shows the CRM widget only with crm.view", () => {
    const withoutPermission = getDashboardWidgets([]);
    const withPermission = getDashboardWidgets(["crm.view"]);

    expect(withoutPermission.some((widget) => widget.id === "crm")).toBe(
      false,
    );

    expect(withPermission.some((widget) => widget.id === "crm")).toBe(true);
  });

  it("shows team performance only with reports.view", () => {
    const withoutPermission = getDashboardWidgets([]);
    const withPermission = getDashboardWidgets(["reports.view"]);

    expect(
      withoutPermission.some((widget) => widget.id === "team-performance"),
    ).toBe(false);

    expect(
      withPermission.some((widget) => widget.id === "team-performance"),
    ).toBe(true);
  });

  it("can show multiple permission-based widgets when permissions allow them", () => {
    const widgets = getDashboardWidgets([
      "inventory.view",
      "crm.view",
      "reports.view",
    ]);

    const widgetIds = widgets.map((widget) => widget.id);

    expect(widgetIds).toContain("inventory");
    expect(widgetIds).toContain("crm");
    expect(widgetIds).toContain("team-performance");
  });

  it("sorts widgets by descending priority", () => {
    const widgets = getDashboardWidgets([
      "inventory.view",
      "crm.view",
      "reports.view",
    ]);

for (let index = 1; index < widgets.length; index += 1) {
  const previousWidget = widgets[index - 1];
  const currentWidget = widgets[index];

  if (!previousWidget || !currentWidget) {
    continue;
  }

  expect(previousWidget.priority).toBeGreaterThanOrEqual(
    currentWidget.priority,
  );
}
  });

  it("does not grant permission-based widgets from unrelated permissions", () => {
    const widgets = getDashboardWidgets([
      "inventory.create",
      "crm.create",
      "reports.edit",
    ]);

    const widgetIds = widgets.map((widget) => widget.id);

    expect(widgetIds).not.toContain("inventory");
    expect(widgetIds).not.toContain("crm");
    expect(widgetIds).not.toContain("team-performance");
  });
});
