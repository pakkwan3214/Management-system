type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

/**
 * Generic error display used across the app shell and individual route
 * segments (via Next.js error.tsx boundary files).
 */
export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50 py-16 text-center"
    >
      <p className="text-sm font-semibold text-red-800">{title}</p>
      <p className="max-w-sm text-sm text-red-700">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}
