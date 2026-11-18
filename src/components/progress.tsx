import {
  ProgressIndicator,
  ProgressLabel,
  Progress as ProgressPart,
  ProgressTrack,
  ProgressValue,
} from "@ui-sdk/react/progress";
import type * as React from "react";
import { cn } from "../lib/cn";
import type { WithClass } from "../lib/types";

type ProgressProps = WithClass<
  Omit<React.ComponentProps<typeof ProgressPart>, "children">
> &
  // A progress bar needs a name: a visible label with its value, or an aria-label.
  (
    | { label: NonNullable<React.ReactNode> }
    | { label?: undefined; "aria-label": string }
  );

/** A bar for a task's progress, between `min` and `max` (0 and 100 by default). A `value` of null shows it under way without a value. */
function Progress({ className, label, ...props }: ProgressProps) {
  return (
    <ProgressPart
      className={cn(
        "au:grid au:min-w-0 au:grid-cols-[1fr_auto] au:items-center au:gap-x-3 au:gap-y-1.5",
        className
      )}
      {...props}
    >
      {label ? (
        <>
          <ProgressLabel className="au:truncate au:text-sm au:font-medium au:text-gray-950">
            {label}
          </ProgressLabel>
          <ProgressValue className="au:tabular au:text-sm au:text-gray-500" />
        </>
      ) : null}
      <ProgressTrack className="au:col-span-full au:h-1.5 au:overflow-hidden au:rounded-full au:bg-alpha/10">
        <ProgressIndicator className="au:h-full au:rounded-full au:bg-accent au:transition-[width] au:duration-200 au:data-indeterminate:w-full au:data-indeterminate:opacity-40 au:motion-safe:data-indeterminate:animate-pulse" />
      </ProgressTrack>
    </ProgressPart>
  );
}

export type { ProgressProps };
export { Progress };
