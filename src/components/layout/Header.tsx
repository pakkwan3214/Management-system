type HeaderProps = {
  onToggleSidebar: () => void;
};

/**
 * Top application header. Currently shows only the product name and a
 * mobile sidebar toggle. Real user/account controls (avatar, sign out,
 * notifications) will be added once authentication exists.
 */
export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 md:hidden"
          aria-label="Toggle navigation menu"
        >
          <MenuIcon />
        </button>
        <span className="text-sm font-semibold tracking-tight text-gray-900">
          Dealership Management System
        </span>
      </div>

      {/* Placeholder for future account/notifications controls. */}
      <div
        className="hidden h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600 sm:flex"
        aria-hidden="true"
        title="Account (placeholder)"
      >
        DM
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
