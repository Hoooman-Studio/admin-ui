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
        "au:flex au:flex-col au:items-center au:justify-center au:px-6 au:py-20 au:text-center",
        className
      )}
    >
      <p className="au:text-base au:font-medium au:text-gray-950">{title}</p>
      {description ? (
        <p className="au:mt-1 au:max-w-sm au:text-sm au:text-gray-600">
          {description}
        </p>
      ) : null}
      {action ? <div className="au:mt-4">{action}</div> : null}
    </div>
  );
}

export type { EmptyStateProps };
export { EmptyState };
