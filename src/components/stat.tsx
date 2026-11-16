import { ArrowDownRightIcon, ArrowUpRightIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "../lib/cn";

const trends = {
  up: { icon: ArrowUpRightIcon, className: "text-green-600" },
  down: { icon: ArrowDownRightIcon, className: "text-red-500" },
};

type StatCardProps = React.ComponentProps<"div"> & {
  label: React.ReactNode;
  value: React.ReactNode;
  /** The change, like "+12%". */
  change?: React.ReactNode;
  /** Up is green, down is red. Leave it out for a neutral change. */
  trend?: keyof typeof trends;
  /** What the change compares to, like "vs last month". */
  hint?: React.ReactNode;
};

/** One number on an overview, like bookings this month. */
function StatCard({
  label,
  value,
  change,
  trend,
  hint,
  className,
  ...props
}: StatCardProps) {
  const Trend = trend ? trends[trend] : undefined;
  return (
    <div
      className={cn(
        "border-alpha/10 shadow-card flex min-w-0 flex-col gap-1 rounded-3xl border bg-gray-50 p-6",
        className
      )}
      {...props}
    >
      <span className="truncate text-base font-medium text-gray-600">
        {label}
      </span>
      <span className="tabular truncate text-3xl font-semibold tracking-[-0.02em] text-gray-950">
        {value}
      </span>
      {change || hint ? (
        <span className="mt-2 flex items-center gap-1.5 text-sm font-medium text-gray-500">
          {change ? (
            <span
              className={cn(
                "tabular flex items-center gap-0.5",
                Trend?.className ?? "text-gray-600"
              )}
            >
              {Trend ? (
                <Trend.icon aria-hidden="true" className="size-4" />
              ) : null}
              {change}
            </span>
          ) : null}
          {hint ? <span className="truncate">{hint}</span> : null}
        </span>
      ) : null}
    </div>
  );
}

/** StatCards in a row of up to four, fewer on narrow pages. */
function StatGrid({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className="@container/stat-grid">
      <div
        className={cn(
          "grid grid-cols-1 gap-4 @md/stat-grid:grid-cols-2 @4xl/stat-grid:grid-cols-4",
          className
        )}
        {...props}
      />
    </div>
  );
}

export type { StatCardProps };
export { StatCard, StatGrid };
