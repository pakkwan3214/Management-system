export type DashboardWidgetId =
  | "tasks"
  | "inventory"
  | "crm"
  | "activity"
  | "notifications"
  | "team-performance";

export type DashboardWidget = {
  id: DashboardWidgetId;
  title: string;
  description: string;
  requiredPermission?: string;
  priority: number;
};

const BASE_WIDGETS: DashboardWidget[] = [
  {
    id: "tasks",
    title: "Today's Tasks",
    description: "Your tasks and follow-ups will appear here.",
    priority: 100,
  },
  {
    id: "activity",
    title: "Recent Activity",
    description: "Recent authorized activity will appear here.",
    priority: 80,
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Your notifications will appear here.",
    priority: 70,
  },
];

const PERMISSION_WIDGETS: DashboardWidget[] = [
  {
    id: "inventory",
    title: "Inventory Summary",
    description: "Inventory information will appear here.",
    requiredPermission: "inventory.view",
    priority: 90,
  },
  {
    id: "crm",
    title: "CRM Summary",
    description: "CRM information will appear here.",
    requiredPermission: "crm.view",
    priority: 90,
  },
  {
    id: "team-performance",
    title: "Team Performance",
    description: "Team performance information will appear here.",
    requiredPermission: "reports.view",
    priority: 60,
  },
];

export function getDashboardWidgets(
  permissionKeys: string[],
): DashboardWidget[] {
  const availableWidgets = [
    ...BASE_WIDGETS,
    ...PERMISSION_WIDGETS.filter(
      (widget) =>
        !widget.requiredPermission ||
        permissionKeys.includes(widget.requiredPermission),
    ),
  ];

  return [...availableWidgets].sort(
    (first, second) => second.priority - first.priority,
  );
}
