type LoadingStateProps = {
  label?: string;
};

/**
 * Generic loading indicator used across the app shell and individual
 * route segments (via Next.js loading.tsx files).
 */
export function LoadingState({ label = "Loading…" }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 py-16 text-sm text-gray-500"
    >
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-brand-500"
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );
}
