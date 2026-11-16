import type * as React from "react";
import { cn } from "../lib/cn";

interface EmptyStateProps {
  /** Usually a Button, like "New listing". */
  action?: React.ReactNode;
  className?: string;
  description?: React.ReactNode;
  title: React.ReactNode;
}

/** What a list or page shows when there is nothing in it yet. */
function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-20 text-center",
        className
      )}
    >
      <p className="text-base font-medium text-gray-950">{title}</p>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-gray-600">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export type { EmptyStateProps };
export { EmptyState };
