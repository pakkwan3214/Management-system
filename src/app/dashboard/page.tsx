import { redirect } from "next/navigation";

import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { getCurrentUser } from "@/lib/auth/session";

import LogoutButton from "./LogoutButton";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

          <p className="mt-1 text-sm text-gray-600">
            Welcome, {user.firstName}. Placeholder widgets. Real data appears
            once inventory, CRM, deals, and other modules are built.
          </p>
        </div>

        <LogoutButton />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard title="Inventory">
          <p className="text-sm text-gray-500">Coming soon</p>
        </DashboardCard>

        <DashboardCard title="Open Deals">
          <p className="text-sm text-gray-500">Coming soon</p>
        </DashboardCard>

        <DashboardCard title="Recent Activity">
          <EmptyState
            title="No activity yet"
            message="Activity will appear here once actions are logged."
          />
        </DashboardCard>
      </div>
    </div>
  );
}
