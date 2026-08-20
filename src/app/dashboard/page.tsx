import { redirect } from "next/navigation";

import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { getCurrentUser } from "@/lib/auth/session";
import { authorize } from "@/lib/authorization/authorization.service";
import { getDashboardWidgets } from "@/lib/dashboard/dashboard-config";

import LogoutButton from "./LogoutButton";

function renderWidgetContent(widgetId: string) {
  switch (widgetId) {
    case "tasks":
      return (
        <p className="text-sm text-gray-500">
          Your tasks will appear here once the task module is implemented.
        </p>
      );

    case "inventory":
      return (
        <p className="text-sm text-gray-500">
          Inventory statistics will appear here once the inventory module is
          implemented.
        </p>
      );

    case "crm":
      return (
        <p className="text-sm text-gray-500">
          CRM statistics will appear here once the CRM module is implemented.
        </p>
      );

    case "activity":
      return (
        <EmptyState
          title="No activity yet"
          message="Recent authorized activity will appear here once activity logging is implemented."
        />
      );

    case "notifications":
      return (
        <p className="text-sm text-gray-500">
          Notifications will appear here once the notification module is
          implemented.
        </p>
      );

    case "team-performance":
      return (
        <p className="text-sm text-gray-500">
          Team performance information will appear here once reporting and
          performance modules are implemented.
        </p>
      );

    default:
      return null;
  }
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

const authorization = await authorize(
  {
    userId: user.id,
  },
  "inventory.view",
);
  const permissionKeys = authorization.permissionKeys ?? [];

  const widgets = getDashboardWidgets(permissionKeys);

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

          <p className="mt-1 text-sm text-gray-600">
            Welcome, {user.firstName}. Your dashboard is organized according to
            your authorized roles and permissions.
          </p>
        </div>

        <LogoutButton />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {widgets.map((widget) => (
          <DashboardCard key={widget.id} title={widget.title}>
            {renderWidgetContent(widget.id)}
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}
