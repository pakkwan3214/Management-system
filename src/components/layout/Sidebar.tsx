"use client";

import Link from "next/link";

type SidebarProps = {
  isOpen?: boolean;
};

type NavItem = {
  label: string;
  href: string;
  permission?: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Inventory", href: "/inventory", permission: "inventory.view" },
  { label: "CRM", href: "/crm", permission: "crm.view" },
  { label: "Vehicle Requests", href: "/vehicle-requests" },
  { label: "Deals", href: "/deals", permission: "deals.view" },
  { label: "Marketing", href: "/marketing" },
  { label: "Reports", href: "/reports", permission: "reports.view" },
  { label: "Activity", href: "/activity" },
  { label: "Employees", href: "/employees", permission: "users.view" },
  { label: "Settings", href: "/settings", permission: "settings.manage" },
];

export function Sidebar({ isOpen = false }: SidebarProps) {
  const sidebarClassName = isOpen
    ? "w-64 border-r bg-white block"
    : "w-64 border-r bg-white hidden md:block";

  return (
    <aside className={sidebarClassName}>
      <nav
        aria-label="Primary"
        data-state={isOpen ? "open" : "closed"}
        className="flex flex-col gap-1 p-4"
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
