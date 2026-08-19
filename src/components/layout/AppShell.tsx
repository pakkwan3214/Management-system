"use client";

import { useState, type ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

type AppShellProps = {
  children: ReactNode;
};

/**
 * Top-level application shell: header + sidebar + main content area.
 * Wraps every route via the root layout. Responsive behavior: the sidebar
 * is always visible on medium+ screens and toggleable on small screens.
 */
export function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col">
      <Header onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-6" data-testid="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
