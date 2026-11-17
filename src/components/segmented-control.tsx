import {
  SegmentedControlIndicator,
  SegmentedControlItem as SegmentedControlItemPart,
  SegmentedControl as SegmentedControlPart,
} from "@ui-sdk/react/segmented-control";
import type * as React from "react";
import { cn } from "../lib/cn";
import type { WithClass } from "../lib/types";

type SegmentedControlProps<T extends string> = Omit<
  React.ComponentProps<typeof SegmentedControlPart<T>>,
  "className" | "children"
> & { className?: string; children?: React.ReactNode };

/** Pick one of a few options, like Open / Archived / All filters. Name it with `aria-label` or a Field. */
function SegmentedControl<T extends string = string>({
  className,
  children,
  ...props
}: SegmentedControlProps<T>) {
  return (
    <SegmentedControlPart<T>
      className={cn(
        "au:bg-alpha/5 au:relative au:isolate au:inline-flex au:w-fit au:items-center au:gap-0.5 au:rounded-full au:p-1 au:data-disabled:opacity-40",
        className
      )}
      {...props}
    >
      <SegmentedControlIndicator className="au:border-alpha/10 au:ease-fluid au:absolute au:top-(--segmented-control-indicator-top) au:left-(--segmented-control-indicator-left) au:-z-10 au:h-(--segmented-control-indicator-height) au:w-(--segmented-control-indicator-width) au:rounded-full au:border au:bg-gray-50 au:transition-[left,width] au:duration-200 au:motion-reduce:transition-none" />
      {children}
    </SegmentedControlPart>
  );
}

function SegmentedControlItem({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof SegmentedControlItemPart>>) {
  return (
    <SegmentedControlItemPart
      className={cn(
        "au:touch-target au:focus-visible:outline-accent au:h-7 au:rounded-full au:px-2.5 au:text-sm au:font-semibold au:whitespace-nowrap au:text-gray-600 au:transition-colors au:duration-100 au:select-none au:hover:text-gray-950 au:focus-visible:outline-2 au:focus-visible:outline-offset-1 au:data-checked:text-gray-950 au:data-disabled:cursor-not-allowed au:data-disabled:opacity-40",
        className
      )}
      {...props}
    />
  );
}

export type { SegmentedControlProps };
export { SegmentedControl, SegmentedControlItem };
