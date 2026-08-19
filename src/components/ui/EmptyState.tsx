type EmptyStateProps = {
  title: string;
  message?: string;
};

/**
 * Generic "nothing here yet" display. Used by dashboard widgets and future
 * modules before real data exists (e.g. activity feed with no events yet).
 */
export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 bg-gray-50 py-10 text-center">
      <p className="text-sm font-medium text-gray-700">{title}</p>
      {message && <p className="max-w-xs text-xs text-gray-500">{message}</p>}
    </div>
  );
}
