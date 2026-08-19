import type { ReactNode } from "react";

type DashboardCardProps = {
  title: string;
  children: ReactNode;
};

/**
 * Placeholder dashboard widget shell. Real widgets (inventory counts,
 * open deals, leaderboards, etc.) will replace these once their modules
 * are built.
 */
export function DashboardCard({ title, children }: DashboardCardProps) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-gray-700">{title}</h2>
      {children}
    </div>
  );
}
