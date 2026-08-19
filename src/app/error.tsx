"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/ErrorState";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Foundation-phase logging. Replace with the real activity/audit
    // logging service once that module exists.
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      title="Something went wrong"
      message="This page failed to load. You can try again."
      onRetry={reset}
    />
  );
}
