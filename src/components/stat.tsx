import { ArrowDownRightIcon, ArrowUpRightIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "../lib/cn";

const trends = {
  up: { icon: ArrowUpRightIcon, className: "au:text-green-600" },
  down: { icon: ArrowDownRightIcon, className: "au:text-red-500" },
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
        "au:border-alpha/10 au:shadow-card au:flex au:min-w-0 au:flex-col au:gap-1 au:rounded-3xl au:border au:bg-gray-50 au:p-6",
        className
      )}
      {...props}
    >
      <span className="au:truncate au:text-base au:font-medium au:text-gray-600">
        {label}
      </span>
      <span className="au:tabular au:truncate au:text-3xl au:font-semibold au:tracking-[-0.02em] au:text-gray-950">
        {value}
      </span>
      {change || hint ? (
        <span className="au:mt-2 au:flex au:items-center au:gap-1.5 au:text-sm au:font-medium au:text-gray-500">
          {change ? (
            <span
              className={cn(
                "au:tabular au:flex au:items-center au:gap-0.5",
                Trend?.className ?? "au:text-gray-600"
              )}
            >
              {Trend ? (
                <Trend.icon aria-hidden="true" className="au:size-4" />
              ) : null}
              {change}
            </span>
          ) : null}
          {hint ? <span className="au:truncate">{hint}</span> : null}
        </span>
      ) : null}
    </div>
  );
}

/** StatCards in a row of up to four, fewer on narrow pages. */
function StatGrid({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className="au:@container/stat-grid">
      <div
        className={cn(
          "au:grid au:grid-cols-1 au:gap-4 au:@md/stat-grid:grid-cols-2 au:@4xl/stat-grid:grid-cols-4",
          className
        )}
        {...props}
      />
    </div>
  );
}

export type { StatCardProps };
export { StatCard, StatGrid };
